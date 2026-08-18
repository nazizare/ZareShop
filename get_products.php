<?php

require_once "db.php";

$sql = "SELECT * FROM products ORDER BY id ASC";

$result = $conn->query($sql);

$products = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {

        $products[] = $row;

    }

}

header("Content-Type: application/json");

echo json_encode($products);

$conn->close();

?>