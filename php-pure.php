<?php

/**
 * Detect if SSL is enabled / on - force to HTTPS if not
 */
function forceSSL () {

    if($_SERVER["HTTPS"] != "on") {
        header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
    }
}

/**
 * Call API to get list of Accounts
 */
function getAccountCodes () {

    //Email isn't set, kick out of the function
    if (!isset($_SESSION['email'])) {
        return false;
    }

    //Fetch accountVerCode via $email from API
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER  => 1,
        CURLOPT_URL             => 'json_file_location?email='. strtolower($_SESSION['email']),
        CURLOPT_USERAGENT       => 'API Data Request'
    ));

    $resp = json_decode(curl_exec($curl));

    //Log error if cURL fails (likely due to network issue)
    //Switch to a fallback if so
    if($errno = curl_errno($curl)) {

        $error_message = curl_strerror($errno);
        error_log("cURL error ({$errno}): {$error_message}");

        //Close the failed connection
        curl_close($curl);
    }

    foreach ($resp as $response) {

        $_SESSION['accountVerCode'] = $response->accountVerCode;
    }

    //Close our connection
    curl_close($curl);

    return true;
}

/**
 * Checks a .txt file for a given email to display admin options
 */
function checkAuthFile ($email) {

    //Open Auth File
    $authFile = file($_SERVER['DOCUMENT_ROOT'] .'/emails.txt');

    foreach ($authFile as $line_num => $line) {

        if ((strpos($line, $email) !== false)) {
            return true;
        }

    }
}

/*
 * Helper function to debug all sessions and variables
 */
function debugAll () {

    error_reporting(E_ALL);

    //Session Info
    echo 'SESSION Data:';
    echo '<pre>';
    var_dump($_SESSION);
    echo '</pre>';

    //SSL
    echo '<strong>URI Data:</strong>';
    echo '<b>HTTPS:</b> '. $_SERVER["HTTPS"];
    echo '<br><b>URL:</b> '. (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    echo '<br><b>IP:</b> '. $_SERVER["SERVER_ADDR"];
    echo '<br><br><b>Referrer:</b> '. $_SERVER["REQUEST_URI"];

}