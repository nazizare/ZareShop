<?php

require_once "require_admin.php";
require_once "db.php";


try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );


    $id =
        (int) ($data["id"] ?? 0);

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

    if ($id <= 0) {

        throw new Exception(
            "Invalid product ID."
        );

    }


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
    // Update Product
    // =========================

    $stmt =
        $conn->prepare("
            UPDATE products

            SET
                name = ?,
                category = ?,
                price = ?,
                image = ?,
                description = ?

            WHERE id = ?
        ");


    $stmt->bind_param(
        "ssdssi",
        $name,
        $category,
        $price,
        $image,
        $description,
        $id
    );


    $stmt->execute();


    $stmt->close();


    echo json_encode([

        "success" => true,

        "message" =>
            "Product updated successfully."

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