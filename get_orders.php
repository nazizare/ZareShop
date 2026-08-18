<?php

require_once "require_admin.php";
require_once "db.php";

try {

    $sql = "
        SELECT
            orders.id,
            customers.first_name,
            customers.last_name,
            customers.email,
            orders.city,
            orders.total,
            orders.created_at
        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        ORDER BY orders.created_at DESC
    ";

    $result = $conn->query($sql);

    $orders = [];

    while ($row = $result->fetch_assoc()) {

        $orders[] = $row;

    }

    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}

$conn->close();

?>