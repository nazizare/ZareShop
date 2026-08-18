<?php

header("Content-Type: application/json");

require_once "db.php";

try {

    // =========================
    // Get Customer Information
    // =========================

    $firstName = trim($_POST["first_name"] ?? "");
    $lastName  = trim($_POST["last_name"] ?? "");
    $email     = strtolower(trim($_POST["email"] ?? ""));
    $phone     = trim($_POST["phone"] ?? "");


    // =========================
    // Validation
    // =========================

    if (
        $firstName === "" ||
        $lastName === "" ||
        $email === "" ||
        $phone === ""
    ) {

        throw new Exception(
            "Please fill in all customer information."
        );

    }


    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        throw new Exception(
            "Please enter a valid email address."
        );

    }


    // =========================
    // Check Existing Customer
    // =========================

    $stmt = $conn->prepare("
        SELECT id
        FROM customers
        WHERE email = ?
        LIMIT 1
    ");

    $stmt->bind_param(
        "s",
        $email
    );

    $stmt->execute();

    $result = $stmt->get_result();

    $stmt->close();


    // =========================
    // Customer Already Exists
    // =========================

    if ($result->num_rows > 0) {

        echo json_encode([

            "success" => true,

            "exists" => true,

            "message" =>
                "Customer already exists."

        ]);

        $conn->close();

        exit;

    }


    // =========================
    // Create New Customer
    // =========================

    $stmt = $conn->prepare("
        INSERT INTO customers
        (
            first_name,
            last_name,
            email,
            phone
        )

        VALUES
        (?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssss",
        $firstName,
        $lastName,
        $email,
        $phone
    );

    $stmt->execute();

    $customerId =
        $conn->insert_id;

    $stmt->close();


    // =========================
    // Success
    // =========================

    echo json_encode([

        "success" => true,

        "exists" => false,

        "customer_id" =>
            $customerId,

        "message" =>
            "Customer saved successfully."

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