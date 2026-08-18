<?php

require_once "require_admin.php";
require_once "db.php";

try {

    // =========================
    // Total Orders
    // =========================

    $result =
        $conn->query("
            SELECT COUNT(*) AS total
            FROM orders
        ");

    $row =
        $result->fetch_assoc();

    $totalOrders =
        (int) $row["total"];


    // =========================
    // Total Products
    // =========================

    $result =
        $conn->query("
            SELECT COUNT(*) AS total
            FROM products
        ");

    $row =
        $result->fetch_assoc();

    $totalProducts =
        (int) $row["total"];


    // =========================
    // Pending Orders
    // =========================

    $stmt =
        $conn->prepare("
            SELECT COUNT(*) AS total
            FROM orders
            WHERE status = ?
        ");

    $status = "pending";

    $stmt->bind_param(
        "s",
        $status
    );

    $stmt->execute();

    $result =
        $stmt->get_result();

    $row =
        $result->fetch_assoc();

    $pendingOrders =
        (int) $row["total"];

    $stmt->close();


    // =========================
    // Total Sales
    // =========================

    $result =
        $conn->query("
            SELECT
                COALESCE(
                    SUM(total),
                    0
                ) AS total
            FROM orders

            WHERE status != 'cancelled'
        ");

    $row =
        $result->fetch_assoc();

    $totalSales =
        (float) $row["total"];


    // =========================
    // Recent Orders
    // =========================

    $result = $conn->query("
        SELECT
            orders.id,
            customers.first_name,
            customers.last_name,
            orders.city,
            orders.total,
            orders.status,
            orders.created_at

        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        ORDER BY orders.created_at DESC

        LIMIT 5
    ");


    $recentOrders = [];


    while ($row = $result->fetch_assoc()) {

        $recentOrders[] = $row;

    }

    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "stats" => [

            "total_orders" =>
                $totalOrders,

            "total_products" =>
                $totalProducts,

            "pending_orders" =>
                $pendingOrders,

            "total_sales" =>
                $totalSales

        ],

        "recent_orders" =>
            $recentOrders

    ]);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>