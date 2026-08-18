```php
<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";


// =========================
// Check Customer Login
// =========================

if (!isset($_SESSION["customer_id"])) {

    http_response_code(401);

    echo json_encode([

        "success" => false,

        "error" =>
            "You must be logged in."

    ]);

    exit;
}


$customerId =
    (int) $_SESSION["customer_id"];


try {

    // =========================
    // Get Customer Orders
    // =========================

    $stmt = $conn->prepare("

        SELECT

            id,
            city,
            total,
            created_at

        FROM orders

        WHERE customer_id = ?

        ORDER BY created_at DESC

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

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>
```
