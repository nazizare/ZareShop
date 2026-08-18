<?php

header("Content-Type: application/json");

require_once "db.php";

try {

    // =========================
    // Get Order ID
    // =========================

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $orderId =
        (int) ($data["order_id"] ?? 0);


    if ($orderId <= 0) {

        throw new Exception(
            "Invalid order ID."
        );

    }


    // =========================
    // Start Transaction
    // =========================

    $conn->begin_transaction();


    // =========================
    // Delete Order Items
    // =========================

    $stmt = $conn->prepare(
        "DELETE FROM order_items
         WHERE order_id = ?"
    );

    $stmt->bind_param(
        "i",
        $orderId
    );

    $stmt->execute();

    $stmt->close();


    // =========================
    // Delete Order
    // =========================

    $stmt = $conn->prepare(
        "DELETE FROM orders
         WHERE id = ?"
    );

    $stmt->bind_param(
        "i",
        $orderId
    );

    $stmt->execute();


    if ($stmt->affected_rows === 0) {

        throw new Exception(
            "Order not found."
        );

    }


    $stmt->close();


    // =========================
    // Commit
    // =========================

    $conn->commit();


    echo json_encode([

        "success" => true,

        "message" =>
            "Order deleted successfully."

    ]);


} catch (Exception $e) {

    // =========================
    // Rollback
    // =========================

    $conn->rollback();


    http_response_code(400);

    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>