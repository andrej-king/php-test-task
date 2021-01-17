<?php

namespace Models;

use Models\Db\Db;

class Results
{
    private $db;

    /**
     * Results constructor.
     */
    public function __construct() {
        $this->db = Db::getInstance();
    }

    // get player id, name, balance, active currency
    public function showPlayers() {
        $result = [];
        $sql =      'SELECT u.id, u.name, uw.userBalance, c.currencyName, uw.walletStatus FROM user_wallets as uw
                     LEFT JOIN currency c on c.id = uw.currencyId
                     LEFT JOIN user u on u.id = uw.userId
                     WHERE uw.walletStatus LIKE 1
                     ORDER BY u.id;';
        $this->db->querySql($sql);
        $count = $this->db->getCount();
        if ($count > 0) {
            while ($row = $this->db->getRow()) {
                $result[] = $row;
            }
        } else {
            return null;
        }

        return $result;
    }

    // get random winner team
    public function gameResults() {
        return ['winner' => random_int(1, 3)];
    }

    // update user wallet
    public function updateWallet(int $userId, float $betAmout, bool $plus = false) {
        $result = [];

        if ($plus) {
            $sql = 'UPDATE user_wallets
                    SET userBalance = userBalance + ' . $betAmout . '
                    WHERE userId = ' . $userId .' and walletStatus = 1';
        } else {
            $sql = 'UPDATE user_wallets
                    SET userBalance = userBalance - ' . $betAmout . '
                    WHERE userId = ' . $userId .' and walletStatus = 1';
        }

        if ($this->db->execSql($sql) > 0) {
            $result[] = ['result' => 'success'];
        } else {
            $result[] = ['result' => 'fail'];
        }

        return $result;
    }
}