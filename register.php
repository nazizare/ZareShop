<?php

header("Content-Type: application/json");

require_once "db.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {
        throw new Exception("Invalid registration data.");
    }


    // =========================
    // Get Customer Information
    // =========================

    $firstName =
        trim($data["firstName"] ?? "");

    $lastName =
        trim($data["lastName"] ?? "");

    $email =
        strtolower(
            trim($data["email"] ?? "")
        );

    $phone =
        trim($data["phone"] ?? "");

    $password =
        $data["password"] ?? "";


    // =========================
    // Validation
    // =========================

    if (
        $firstName === "" ||
        $lastName === "" ||
        $email === "" ||
        $phone === "" ||
        $password === ""
    ) {

        throw new Exception(
            "Please fill in all fields."
        );

    }


    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        throw new Exception(
            "Please enter a valid email address."
        );

    }


    if (strlen($password) < 8) {

        throw new Exception(
            "Password must be at least 8 characters."
        );

    }


    // =========================
    // Check Existing Email
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

    $result =
        $stmt->get_result();

    $stmt->close();


    if ($result->num_rows > 0) {

        throw new Exception(
            "An account with this email already exists."
        );

    }


    // =========================
    // Hash Password
    // =========================

    $passwordHash =
        password_hash(
            $password,
            PASSWORD_DEFAULT
        );


    // =========================
    // Create Customer
    // =========================

    $stmt = $conn->prepare("
        INSERT INTO customers
        (
            first_name,
            last_name,
            email,
            phone,
            password
        )

        VALUES
        (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssss",
        $firstName,
        $lastName,
        $email,
        $phone,
        $passwordHash
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

        "message" =>
            "Account created successfully.",

        "customer_id" =>
            $customerId

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