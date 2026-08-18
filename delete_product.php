<?php

require_once "require_admin.php";
require_once "db.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $productId =
        (int) ($data["product_id"] ?? 0);


    if ($productId <= 0) {

        throw new Exception(
            "Invalid product ID."
        );

    }


    // =========================
    // Check Order Items
    // =========================

    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM order_items
        WHERE product_id = ?
    ");

    $stmt->bind_param(
        "i",
        $productId
    );

    $stmt->execute();

    $result =
        $stmt->get_result();

    $row =
        $result->fetch_assoc();

    $stmt->close();


    if ((int) $row["total"] > 0) {

        throw new Exception(
            "This product cannot be deleted because it is used in an order."
        );

    }


    // =========================
    // Delete Product
    // =========================

    $stmt = $conn->prepare("
        DELETE FROM products
        WHERE id = ?
    ");

    $stmt->bind_param(
        "i",
        $productId
    );

    $stmt->execute();


    if ($stmt->affected_rows === 0) {

        throw new Exception(
            "Product not found."
        );

    }


    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Product deleted successfully."

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