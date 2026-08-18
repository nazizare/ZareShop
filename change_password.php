<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";

try {

    if (!isset($_SESSION["customer_id"])) {

        throw new Exception(
            "Customer login required."
        );

    }


    $customerId =
        (int) $_SESSION["customer_id"];


    $data = json_decode(
        file_get_contents("php://input"),
        true
    );


    if (!$data) {

        throw new Exception(
            "Invalid password data."
        );

    }


    $currentPassword =
        $data["current_password"] ?? "";

    $newPassword =
        $data["new_password"] ?? "";

    $confirmPassword =
        $data["confirm_password"] ?? "";


    if (
        $currentPassword === "" ||
        $newPassword === "" ||
        $confirmPassword === ""
    ) {

        throw new Exception(
            "Please fill in all password fields."
        );

    }


    if (
        strlen($newPassword) < 8
    ) {

        throw new Exception(
            "New password must be at least 8 characters."
        );

    }


    if (
        $newPassword !==
        $confirmPassword
    ) {

        throw new Exception(
            "New passwords do not match."
        );

    }


    // =========================
    // Get Current Password
    // =========================

    $stmt = $conn->prepare("
        SELECT password
        FROM customers
        WHERE id = ?
    ");


    $stmt->bind_param(
        "i",
        $customerId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Customer not found."
        );

    }


    $customer =
        $result->fetch_assoc();


    $stmt->close();


    // =========================
    // Verify Current Password
    // =========================

    if (
        empty($customer["password"]) ||
        !password_verify(
            $currentPassword,
            $customer["password"]
        )
    ) {

        throw new Exception(
            "Current password is incorrect."
        );

    }


    // =========================
    // Hash New Password
    // =========================

    $hashedPassword =
        password_hash(
            $newPassword,
            PASSWORD_DEFAULT
        );


    // =========================
    // Update Password
    // =========================

    $stmt = $conn->prepare("
        UPDATE customers
        SET password = ?
        WHERE id = ?
    ");


    $stmt->bind_param(
        "si",
        $hashedPassword,
        $customerId
    );


    $stmt->execute();


    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Password changed successfully."

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