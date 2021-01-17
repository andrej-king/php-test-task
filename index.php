<?php
//error_reporting(0);
//ini_set('display_errors', 0);

require_once 'config.php';
require_once 'System/autoload.php';

use System\App;

$app = new App();
$app::run();
?>