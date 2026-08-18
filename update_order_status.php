<?php

require_once "require_admin.php";
require_once "db.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $orderId = (int) ($data["order_id"] ?? 0);
    $status = trim($data["status"] ?? "");

    // =========================
    // Validate
    // =========================

    $allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ];

    if ($orderId <= 0) {

        throw new Exception(
            "Invalid order ID."
        );

    }

    if (!in_array(
        $status,
        $allowedStatuses,
        true
    )) {

        throw new Exception(
            "Invalid order status."
        );

    }


    // =========================
    // Update Order
    // =========================

    $stmt = $conn->prepare(
        "UPDATE orders
         SET status = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "si",
        $status,
        $orderId
    );

    $stmt->execute();


    if ($stmt->affected_rows === 0) {

        throw new Exception(
            "Order not found or status unchanged."
        );

    }

    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Order status updated."

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