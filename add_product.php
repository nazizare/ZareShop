<?php

require_once "require_admin.php";
require_once "db.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );


    $name =
        trim($data["name"] ?? "");

    $category =
        trim($data["category"] ?? "");

    $price =
        $data["price"] ?? null;

    $image =
        trim($data["image"] ?? "");

    $description =
        trim($data["description"] ?? "");


    // =========================
    // Validation
    // =========================

    if (
        $name === "" ||
        $category === "" ||
        $price === null ||
        $image === ""
    ) {

        throw new Exception(
            "Please fill in all required fields."
        );

    }


    if (!is_numeric($price)) {

        throw new Exception(
            "Invalid price."
        );

    }


    $price =
        (float) $price;


    // =========================
    // Insert Product
    // =========================

    $stmt = $conn->prepare("
        INSERT INTO products
        (
            name,
            category,
            price,
            image,
            description
        )

        VALUES
        (?, ?, ?, ?, ?)
    ");


    $stmt->bind_param(
        "ssdss",
        $name,
        $category,
        $price,
        $image,
        $description
    );


    $stmt->execute();


    $newProductId =
        $stmt->insert_id;


    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Product added successfully.",

        "product_id" =>
            $newProductId

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