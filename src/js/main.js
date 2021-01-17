$(document).ready(function () {
	var user; // for info about selected user

	// event click send form
	$('#get-bet-btn').click(function (e) {
		e.preventDefault();
		let errorMsgBox = $('.error_msg');
		let fullBetAmount = parseFloat(0);
		let errors = [];
		let success = [];

		// count full bet amount
		$('.bet-amount').each(function () {
			let betAmountValue = parseFloat($(this).val());
			if (!isNaN(betAmountValue) && betAmountValue > 0) {
				fullBetAmount += betAmountValue;
			}
		})

		if (parseFloat($(`.bet-football input[type=number]`).val()) > 0 &&
			$(`.bet-football .select-result-football input[type=radio]:checked`).length > 0) {
			success.push('bet-football');
		}
		if (parseFloat($(`.bet-baseball input[type=number]`).val()) > 0 &&
			$(`.bet-baseball input[type=radio]:checked`).length > 0) {
			success.push('bet-baseball');
		}

		if ($('#list-players').val() < 1) {
			errors.push("Не выбран игрок ");
		}

		if ($("input[name='choosing_football_winner']:checked").length < 1 &&
			$("input[name='choosing_baseball_winner']:checked").length < 1) {
			errors.push("Не выбрана ставка ");
		}
		try {
			if (fullBetAmount > user.userBalance) {
				errors.push("Общая сумма ставки превышает баланс");
			} else if (fullBetAmount < 1) {
				errors.push("Не выбрана сумма ставки")
			}
		} catch (e) {
		}

		// show errors
		if (errors.length > 0) {
			let errorText = '';
			$.each(errors, function (key, value) {
				errorText += value + "<br>";
			});
			errorMsgBox.html(errorText);
			$('.bet-result').text('');
		} else {
			errorMsgBox.text('');
		}

		// all is ok, no errors
		if (errors.length === 0 && success.length > 0) {
			let resultBox = $('.bet-result');
			let betData = [];
			let gameName, betAmount, selectedWinnerValue, coefficient;
			let tmpGameResultMessage = '';

			$.each(success, (key, value) => {
				gameName = value;
				betAmount = $(`.${gameName} input[type=number]`).val();
				selectedWinnerValue = $(`.${gameName} input[type=radio]:checked`).val();
				coefficient = 'coefficient-' + selectedWinnerValue;
				coefficient = $(`#${coefficient}`).text();
				selectedWinnerNumber = selectedWinnerValue.substr(selectedWinnerValue.length - 1);

				betData.push({
					gameName:               gameName,
					betAmount:              betAmount,
					selectedWinnerValue:    selectedWinnerValue,
					coefficient:            coefficient,
					selectedWinnerNum:      selectedWinnerNumber
				})
			});

			if (betData.length > 0) {
				resultBox.text('');
				let checkboxFootball = $('.forceResultFootballWrap input[type=checkbox]:checked').val();
				let checkboxBaseball = $('.forceResultBaseballWrap input[type=checkbox]:checked').val();


				$.each(betData, function (key, value) {
					getGameResult(function(output){
						let winner = parseInt(output.winner);
						let gameResult, selectedTeam;

						let winnerNum = parseInt(value.selectedWinnerNum);

						if (gameName === 'bet-football') {
							if (checkboxFootball === "footballForceWin") {
								winner = winnerNum;
							} else if (checkboxFootball === "footballForceLose") {
								if (winnerNum === 1) {
									winner = 2;
								} else if (winnerNum == 2){
									winner = 3;
								} else {
									winner = 1
								}
							}
						} else if (gameName === 'bet-baseball') {
							if (checkboxBaseball === "baseballForceWin") {
								winner = winnerNum;
							} else if (checkboxBaseball === "baseballForceLose") {
								if (winnerNum === 1) {
									winner = 2;
								} else if (winnerNum == 2){
									winner = 3;
								} else {
									winner = 1
								}
							}
						}


						switch (winner) {
							case 1:
								gameResult = "Победила первая команда";
								break;
							case 2:
								gameResult = "Победила вторая команда";
								break;
							case 3:
								gameResult = "Ничья";
								break;
							default:
								gameResult = "Ошибка";
								break;
						}

						switch (value.selectedWinnerValue) {
							case 'football-win-1':
								selectedTeam = 'Футбол, команда 1';
								break;
							case 'football-win-2':
								selectedTeam = 'Футбол, команда 2';
								break;
							case 'football-draw-3':
								selectedTeam = 'Футбол, ничья';
								break;
							case 'baseball-win-1':
								selectedTeam = 'Бейсбол, команда 1';
								break;
							case 'baseball-win-2':
								selectedTeam = 'Бейсбол, команда 2';
								break;
							case 'baseball-draw-3':
								selectedTeam = 'Бейсбол, ничья';
								break;
						}

						let betAmount = Math.round(value.betAmount * 100) / 100;
						tmpGameResultMessage = `Ставка: ${betAmount}<br>Коэффициент: ${value.coefficient}<br>Ваша ставка: "${selectedTeam}"<br>Результат игры: ${gameResult}<br>`;

						if (winnerNum === winner) {
							let winAmount = (parseFloat(parseFloat(betAmount) * parseFloat(value.coefficient))) - parseFloat(value.betAmount);
							winAmount = Math.round((winAmount + Number.EPSILON) * 100) / 100;
							updateUserWallet(user.id, winAmount, 'plus', function(updateOutput){
								userData = getUsersData();
							});
							$('#football-stake-amount-info, #baseball-stake-amount-info').text('Сумма ставки'); // show user balance
							tmpGameResultMessage += `<span class="text-green">Вам зачислено ${winAmount} ${user.currencyName}</span><br><br>`;
						} else {
							updateUserWallet(user.id, betAmount, 'minus', function(updateOutput){
								userData = getUsersData();
							});
							$('#football-stake-amount-info, #baseball-stake-amount-info').text('Сумма ставки'); // show user balance
							tmpGameResultMessage += `<span class="text-red">Вы проиграли ${betAmount} ${user.currencyName}</span><br><br>`;
							tmpGameResultMessage += `Баланс: ${user.userBalance} ${user.currencyName}`;
						}

						resultBox.append(tmpGameResultMessage);
					})
				});
			}
			resetAllInputs('input[type=radio]');
			resetAllInputs("input[type=number]");
			resetAllInputs("input[type=checkbox]");
		}
	});

	// selectbox with users
	$('#list-players').on('change', function() {
		let userId = this.value -1;
		user = userData[userId];
		if (user.userBalance > 0) {
			$("#football-stake_amount, #baseball-stake-amount").attr({ // set maximum bet value <= balance
				"max" : user.userBalance
			});
			$('#football-stake-amount-info, #baseball-stake-amount-info').text(`1 - ${user.userBalance} ${user.currencyName}`); // show user balance
		} else {
			$("#football-stake_amount, #baseball-stake-amount").attr({ // set maximum bet value <= balance
				"min" : 0,
				"max" : 0
			});
			$('#football-stake-amount-info, #baseball-stake-amount-info').text(`balance ${user.userBalance} ${user.currencyName}`); // show user balance
		}
	});

	// allow only one active checkbox
	$('.forceResultFootballWrap input:checkbox').click(function() {
		$('.forceResultFootballWrap input:checkbox').not(this).prop('checked', false);
	});
	$('.forceResultBaseballWrap input:checkbox').click(function() {
		$('.forceResultBaseballWrap input:checkbox').not(this).prop('checked', false);
	});

	addChoosingBg('choosing_football_winner');
	addChoosingBg('choosing_baseball_winner');
});

var userData = getUsersData();



function addChoosingBg(inputName) {
	$(`input[name=${inputName}]`).on("change", function () {
		$(`input[name=${inputName}]`).each(function () {
			if ($(this).is(":checked")) {
				$('.' + this.value).addClass('active-bg-teams');
			} else if (!$(this).is(":checked")) {
				$('.' + this.value).removeClass('active-bg-teams');
			}
		})
	});
}

function resetAllInputs(input) {
	$('input:radio').each(function () { $(this).prop('checked', false); });

	$.each($(`${input}`), function () {
		if (input === "input[type=radio]") {
			$(this).prop('checked', false);
			$('.' + this.value).removeClass('active-bg-teams');
		}
		if (input === "input[type=number]") {
			$(this).val('');
		}
		if (input === "input[type=checkbox]") {
			$(this).prop('checked', false);
		}
	})
}

// get general user data
function getUsersData() {
	var userData = [];
	$.ajax({
		type: "POST",
		url: "/main/data",
		dataType : "json",
		async: true,
		data: {getUsers: 1}
	}).done(function (data) {
		if (data.err_msg !== 'empty') {
			let users = '<option selected disabled value="">Выберите игрока</option>\n';
			$.each(data, function (key, value) {
				users += `<option value="${value.id}">${value.name}</option>\n`;
				userData.push({id: value.id, name: value.name, userBalance: value.userBalance, currencyName: value.currencyName});
			});
			$('#list-players').html(users);
		}
	});
	return userData;
}


// get game results
function getGameResult(callback) {
	$.ajax({
		type: "POST",
		url: "/main/results",
		dataType : "json",
		data: {getGameResult: "data"},
		success:function(data) {
			callback(data);
		}
	});
}

// update user wallet
function updateUserWallet(userId, betAmount, sign, callback) {
	$.ajax({
		type: "POST",
		url: "/main/updatewallet",
		dataType : "json",
		data: {
			'updateWallet': 'yes',
			'userId':       userId,
			'betAmount':    betAmount,
			'sign':         sign
		},
		success:function(data) {
			callback(data);
		}
	});
}

/*
function checkNotEmptyBetAndSelectWinner(classInputsWrap) {
	$(`${classInputsWrap} input`).each(function () {
		if (parseInt($(`${classInputsWrap} input[type=number]`).val()) > 0 &&
			$(`${classInputsWrap} input[type=radio]:checked`).length > 0) {
			return true;
		} else {
			return false;
		}
	});
}*/