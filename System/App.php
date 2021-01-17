<?php

namespace System;

class App
{
    public static function run() {
        $path       = $_SERVER['REQUEST_URI'];
        $pathParts  = explode('/', $path);
        $controller = $pathParts[1];
        $action     = $pathParts[2];


        $mainController  = 'Controllers\MainController';
        $actionMain      = 'actionMain';
        $actionError     = 'actionError';


        if (!empty($controller)) {
            $controller = 'Controllers\\' . ucfirst($controller) . 'Controller';
        } else {
            $controller = $mainController;
        }

        if (!empty($action)) {
            $action = 'action' . ucfirst($action);
        } else {
            $action = $actionMain;
        }

        if (!class_exists($controller)) {
//            throw new \ErrorException('Controller does not exist');
            $controller = $mainController;
        }

        $objController = new $controller;

        if (!method_exists($objController, $action)) {
//            throw new \ErrorException('action does not exist');
            $objController->$actionError();
        } else {
            $objController->$action();
        }
    }
}