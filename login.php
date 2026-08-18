<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {

        throw new Exception(
            "Invalid login data."
        );

    }


    // =========================
    // Get Login Information
    // =========================

    $email =
        strtolower(
            trim($data["email"] ?? "")
        );

    $password =
        $data["password"] ?? "";


    // =========================
    // Validation
    // =========================

    if (
        $email === "" ||
        $password === ""
    ) {

        throw new Exception(
            "Please enter your email and password."
        );

    }


    if (!filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )) {

        throw new Exception(
            "Please enter a valid email address."
        );

    }


    // =========================
    // Find Customer
    // =========================

    $stmt = $conn->prepare("
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            password
        FROM customers
        WHERE email = ?
        LIMIT 1
    ");

    $stmt->bind_param(
        "s",
        $email
    );

    $stmt->execute();

    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Invalid email or password."
        );

    }


    $customer =
        $result->fetch_assoc();

    $stmt->close();


    // =========================
    // Verify Password
    // =========================

    if (
        empty($customer["password"]) ||
        !password_verify(
            $password,
            $customer["password"]
        )
    ) {

        throw new Exception(
            "Invalid email or password."
        );

    }


    // =========================
    // Create Customer Session
    // =========================

    session_regenerate_id(true);


    $_SESSION["customer_id"] =
        (int) $customer["id"];

    $_SESSION["customer_email"] =
        $customer["email"];

    $_SESSION["customer_name"] =
        $customer["first_name"] .
        " " .
        $customer["last_name"];


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "message" =>
            "Login successful.",

        "customer" => [

            "id" =>
                (int) $customer["id"],

            "first_name" =>
                $customer["first_name"],

            "last_name" =>
                $customer["last_name"],

            "email" =>
                $customer["email"],

            "phone" =>
                $customer["phone"]

        ]

    ]);


} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>