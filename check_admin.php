<?php

session_start();

header("Content-Type: application/json");


if (!isset($_SESSION["admin_id"])) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" => "Unauthorized."
    ]);

    exit;

}


echo json_encode([
    "success" => true,
    "admin_id" => $_SESSION["admin_id"],
    "username" => $_SESSION["admin_username"]
]);

?>