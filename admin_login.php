<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";


try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );


    $username =
        trim($data["username"] ?? "");

    $password =
        $data["password"] ?? "";


    if (
        $username === "" ||
        $password === ""
    ) {

        throw new Exception(
            "Username and password are required."
        );

    }


    // =========================
    // Find Admin
    // =========================

    $stmt = $conn->prepare("
        SELECT id, username, password
        FROM admins
        WHERE username = ?
        LIMIT 1
    ");


    $stmt->bind_param(
        "s",
        $username
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Invalid username or password."
        );

    }


    $admin =
        $result->fetch_assoc();


    // =========================
    // Verify Password
    // =========================

    if (
        !password_verify(
            $password,
            $admin["password"]
        )
    ) {

        throw new Exception(
            "Invalid username or password."
        );

    }


    // =========================
    // Create Session
    // =========================

    session_regenerate_id(true);


    $_SESSION["admin_id"] =
        $admin["id"];


    $_SESSION["admin_username"] =
        $admin["username"];


    echo json_encode([

        "success" => true,

        "message" =>
            "Login successful."

    ]);


    $stmt->close();


} catch (Exception $e) {

    http_response_code(401);

    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>