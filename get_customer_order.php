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
    // Get Order ID
    // =========================

    if (!isset($_GET["id"])) {

        throw new Exception(
            "Order ID is required."
        );

    }

    $orderId =
        (int) $_GET["id"];


    // =========================
    // Get Order
    // IMPORTANT:
    // Only this customer's order
    // =========================

    $stmt = $conn->prepare("
        SELECT
            orders.id,
            orders.address,
            orders.city,
            orders.postal_code,
            orders.total,
            orders.created_at,
            orders.status,

            customers.first_name,
            customers.last_name,
            customers.email,
            customers.phone

        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        WHERE orders.id = ?
        AND orders.customer_id = ?

        LIMIT 1
    ");

    $stmt->bind_param(
        "ii",
        $orderId,
        $customerId
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
    // Get Order Items
    // =========================

    $stmt = $conn->prepare("
        SELECT
            order_items.id,
            order_items.product_id,
            order_items.quantity,
            order_items.price,

            products.name,
            products.image

        FROM order_items

        INNER JOIN products
            ON order_items.product_id = products.id

        WHERE order_items.order_id = ?

        ORDER BY order_items.id ASC
    ");

    $stmt->bind_param(
        "i",
        $orderId
    );

    $stmt->execute();

    $result =
        $stmt->get_result();


    $items = [];


    while ($row = $result->fetch_assoc()) {

        $items[] = $row;

    }


    $stmt->close();


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "order" => $order,

        "items" => $items

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