<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

try {

    // =========================
    // Get JSON Data
    // =========================

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {

        throw new Exception(
            "Invalid order data."
        );

    }


    // =========================
    // Customer Information
    // =========================

    $customer =
        $data["customer"] ?? [];

    $firstName =
        trim($customer["firstName"] ?? "");

    $lastName =
        trim($customer["lastName"] ?? "");

    $email =
        strtolower(
            trim($customer["email"] ?? "")
        );

    $phone =
        trim($customer["phone"] ?? "");

    $address =
        trim($customer["address"] ?? "");

    $city =
        trim($customer["city"] ?? "");

    $postalCode =
        trim($customer["postalCode"] ?? "");


    $items =
        $data["items"] ?? [];


    // =========================
    // Validation
    // =========================

    if (
        $firstName === "" ||
        $lastName === "" ||
        $email === "" ||
        $phone === "" ||
        $address === "" ||
        $city === "" ||
        $postalCode === "" ||
        empty($items)
    ) {

        throw new Exception(
            "Missing customer information or cart items."
        );

    }


    if (!filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )) {

        throw new Exception(
            "Invalid email address."
        );

    }


    // =========================
    // Start Transaction
    // =========================

    $conn->begin_transaction();


    // =========================
    // Find Existing Customer
    // =========================

    $stmt = $conn->prepare("
        SELECT id
        FROM customers
        WHERE LOWER(email) = ?
        LIMIT 1
    ");

    $stmt->bind_param(
        "s",
        $email
    );

    $stmt->execute();

    $result =
        $stmt->get_result();


    // =========================
    // Customer Exists
    // =========================

    if ($result->num_rows > 0) {

        $customer =
            $result->fetch_assoc();

        $customerId =
            (int) $customer["id"];

        $stmt->close();


        // Update customer information

        $stmt = $conn->prepare("
            UPDATE customers

            SET
                first_name = ?,
                last_name = ?,
                phone = ?

            WHERE id = ?
        ");

        $stmt->bind_param(
            "sssi",
            $firstName,
            $lastName,
            $phone,
            $customerId
        );

        $stmt->execute();

        $stmt->close();


    } else {

        // =========================
        // Create New Customer
        // =========================

        $stmt = $conn->prepare("
            INSERT INTO customers
            (
                first_name,
                last_name,
                email,
                phone
            )

            VALUES
            (?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "ssss",
            $firstName,
            $lastName,
            $email,
            $phone
        );

        $stmt->execute();

        $customerId =
            $conn->insert_id;

        $stmt->close();

    }


    // =========================
    // Create Order
    // =========================

    $stmt = $conn->prepare("
        INSERT INTO orders
        (
            customer_id,
            address,
            city,
            postal_code,
            total
        )

        VALUES
        (?, ?, ?, ?, ?)
    ");


    // =========================
    // Calculate Total
    // =========================

    $total = 0;


    foreach ($items as $item) {

        $quantity =
            (int) ($item["quantity"] ?? 0);

        if ($quantity <= 0) {

            throw new Exception(
                "Invalid product quantity."
            );

        }

        $productId =
            (int) ($item["id"] ?? 0);

        if ($productId <= 0) {

            throw new Exception(
                "Invalid product ID."
            );

        }


        // Get current product price from database

        $priceStmt = $conn->prepare("
            SELECT price
            FROM products
            WHERE id = ?
            LIMIT 1
        ");

        $priceStmt->bind_param(
            "i",
            $productId
        );

        $priceStmt->execute();

        $priceResult =
            $priceStmt->get_result();


        if ($priceResult->num_rows === 0) {

            $priceStmt->close();

            throw new Exception(
                "Product not found."
            );

        }


        $product =
            $priceResult->fetch_assoc();

        $price =
            (float) $product["price"];


        $priceStmt->close();


        $total +=
            $price * $quantity;

    }


    // =========================
    // Save Order
    // =========================

    $stmt->bind_param(
        "isssd",
        $customerId,
        $address,
        $city,
        $postalCode,
        $total
    );

    $stmt->execute();

    $orderId =
        $conn->insert_id;

    $stmt->close();


    // =========================
    // Save Order Items
    // =========================

    $stmt = $conn->prepare("
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price
        )

        VALUES
        (?, ?, ?, ?)
    ");


    foreach ($items as $item) {

        $productId =
            (int) $item["id"];

        $quantity =
            (int) $item["quantity"];


        // Get current database price again

        $priceStmt = $conn->prepare("
            SELECT price
            FROM products
            WHERE id = ?
            LIMIT 1
        ");

        $priceStmt->bind_param(
            "i",
            $productId
        );

        $priceStmt->execute();

        $priceResult =
            $priceStmt->get_result();

        $product =
            $priceResult->fetch_assoc();

        $price =
            (float) $product["price"];

        $priceStmt->close();


        $stmt->bind_param(
            "iiid",
            $orderId,
            $productId,
            $quantity,
            $price
        );

        $stmt->execute();

    }

    $stmt->close();


    // =========================
    // Commit
    // =========================

    $conn->commit();


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "order_id" =>
            $orderId,

        "customer_id" =>
            $customerId,

        "total" =>
            $total

    ]);


} catch (Exception $e) {

    // =========================
    // Rollback
    // =========================

    if (
        isset($conn) &&
        $conn->connect_errno === 0
    ) {

        $conn->rollback();

    }


    http_response_code(400);


    echo json_encode([

        "success" => false,

        "error" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>