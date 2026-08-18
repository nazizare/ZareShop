<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";

try {

    // =========================
    // Check Customer Login
    // =========================

    if (!isset($_SESSION["customer_id"])) {

        throw new Exception(
            "Please login first."
        );

    }


    $customerId =
        (int) $_SESSION["customer_id"];


    // =========================
    // Get Customer Orders
    // =========================

    $stmt = $conn->prepare("
        SELECT

            orders.id,
            orders.address,
            orders.city,
            orders.postal_code,
            orders.total,
            orders.status,
            orders.created_at

        FROM orders

        WHERE orders.customer_id = ?

        ORDER BY orders.created_at DESC
    ");


    $stmt->bind_param(
        "i",
        $customerId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    $orders = [];


    while (
        $row =
        $result->fetch_assoc()
    ) {

        $orders[] = $row;

    }


    $stmt->close();


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "orders" => $orders

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