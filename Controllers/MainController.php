<?php

namespace Controllers;

use Models\Results;
use System\View;

class MainController
{

    // render main page
    public function actionMain() {
        View::render('parts/header');
        View::render('main');
        View::render('parts/footer');
    }

    public function actionData() {
        if (isset($_POST['getUsers']) && !empty(isset($_POST['getUsers']))) {
            $model = new Results();
            $result = $model->showPlayers();

            if (empty($result)) {
                $result['err_msg'] = 'empty';
            }

            echo json_encode($result, true);
        }
    }

    public function actionResults() {
        if (isset($_POST['getGameResult']) && !empty($_POST['getGameResult'])) {
            $model = new Results();
            $result = $model->gameResults();

            echo json_encode($result, true);
        }
    }

    public function actionUpdatewallet() {
        if ((isset($_POST['updateWallet'])  && !empty($_POST['updateWallet']))   &&
            (isset($_POST['userId'])        && !empty($_POST['userId']))         &&
            (isset($_POST['betAmount'])     && !empty($_POST['betAmount']))      &&
            (isset($_POST['sign'])          && !empty($_POST['sign']))
        ) {

            $userId     = $_POST['userId'];
            $betAmount  = $_POST['betAmount'];
            $sign       = $_POST['sign'];

            if ((is_numeric($userId) && $userId > 0)        &&
                (is_numeric($betAmount) && $betAmount > 0)  &&
                ($sign == 'plus' || $sign == 'minus')
            ) {
                $model = new Results();

                if ($sign == 'plus') {
                    $result = $model->updateWallet($userId, $betAmount, true);
                } else {
                    $result = $model->updateWallet($userId, $betAmount, false);
                }

                $result[] = ['userId' => $userId, 'betAmount' => $betAmount, 'sign' => $sign];
                echo json_encode($result, true);
            }
        }
    }

    public function actionError() {
        View::render('404');
    }
}