<?php

header("Content-Type: application/json");

require_once "db.php";


try {

    // =========================
    // Get Customers
    // =========================

    $sql = "
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at
        FROM customers
        ORDER BY created_at DESC
    ";


    $result =
        $conn->query($sql);


    if (!$result) {

        throw new Exception(
            "Failed to load customers."
        );

    }


    $customers = [];


    while (
        $row =
        $result->fetch_assoc()
    ) {

        $customers[] = $row;

    }


    // =========================
    // Response
    // =========================

    echo json_encode([

        "success" => true,

        "customers" => $customers

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