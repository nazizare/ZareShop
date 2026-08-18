<?php

header("Content-Type: application/json");

require_once "db.php";

try {

    // =========================
    // Get Order ID
    // =========================

    $orderId =
        (int) ($_GET["id"] ?? 0);


    if ($orderId <= 0) {

        throw new Exception(
            "Invalid order ID."
        );

    }


    // =========================
    // Get Order + Customer
    // =========================

    $stmt = $conn->prepare("
        SELECT

            orders.id,
            orders.total,
            orders.created_at,

            customers.id AS customer_id,
            customers.first_name,
            customers.last_name,
            customers.email

        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        WHERE orders.id = ?

        LIMIT 1
    ");


    $stmt->bind_param(
        "i",
        $orderId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Order not found."
        );

    }


    $order =
        $result->fetch_assoc();


    $stmt->close();


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "order" => [

            "id" =>
                (int) $order["id"],

            "total" =>
                (float) $order["total"],

            "first_name" =>
                $order["first_name"],

            "last_name" =>
                $order["last_name"],

            "email" =>
                $order["email"]

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