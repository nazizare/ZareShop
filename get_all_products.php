<?php

header("Content-Type: application/json");

require_once "db.php";

try {

    $result = $conn->query("
        SELECT
            id,
            name,
            category,
            price,
            image,
            description,
            created_at
        FROM products
        ORDER BY id DESC
    ");


    if (!$result) {

        throw new Exception(
            "Failed to load products."
        );

    }


    $products = [];


    while ($row = $result->fetch_assoc()) {

        $products[] = $row;

    }


    echo json_encode([

        "success" => true,

        "products" => $products

    ]);


} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "error" => $e->getMessage()

    ]);

}


$conn->close();

?>