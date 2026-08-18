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
            "Invalid customer data."
        );

    }


    $firstName =
        trim($data["first_name"] ?? "");

    $lastName =
        trim($data["last_name"] ?? "");

    $phone =
        trim($data["phone"] ?? "");


    if (
        $firstName === "" ||
        $lastName === "" ||
        $phone === ""
    ) {

        throw new Exception(
            "Please fill in all fields."
        );

    }


    $stmt = $conn->prepare("
        UPDATE customers
        SET
            first_name = ?,
            last_name = ?,
            phone = ?
        WHERE id = ?
    ");


    $stmt->bind_param(
        "sssi",
        $firstName,
        $lastName,
        $phone,
        $customerId
    );


    $stmt->execute();

    $stmt->close();


    // Update Session

    $_SESSION["customer_name"] =
        $firstName . " " . $lastName;


    // Get updated customer

    $stmt = $conn->prepare("
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone
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


    $customer =
        $result->fetch_assoc();


    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Profile updated successfully.",

        "customer" =>
            $customer

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