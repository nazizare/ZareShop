<?php

require_once "require_admin.php";
require_once "db.php";


try {

    if (!isset($_GET["id"])) {

        throw new Exception(
            "Product ID is required."
        );

    }


    $id =
        (int) $_GET["id"];


    if ($id <= 0) {

        throw new Exception(
            "Invalid product ID."
        );

    }


    $stmt =
        $conn->prepare("
            SELECT
                id,
                name,
                category,
                price,
                image,
                description,
                created_at

            FROM products

            WHERE id = ?
        ");


    $stmt->bind_param(
        "i",
        $id
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Product not found."
        );

    }


    $product =
        $result->fetch_assoc();


    echo json_encode([

        "success" => true,

        "product" => $product

    ]);


    $stmt->close();


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