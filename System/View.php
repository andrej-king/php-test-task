<?php

namespace System;

class View
{
    /*
     * @param string $path
     * @throws \ErrorException
     */
    public static function render(string $path) {
        // get full path to files html
        $fullPath = __DIR__ . '/../Views/' . $path . '.html';

        // if file not found throw except
        if (!file_exists($fullPath)) {
            throw new \ErrorException('view cannot be found');
        }

        // show file
        include($fullPath);
    }
}