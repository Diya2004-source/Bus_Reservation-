<?php
error_reporting(0); // Disable warnings

include "../db.php";

$from = isset($_GET['from']) ? strtolower($_GET['from']) : "";
$to = isset($_GET['to']) ? strtolower($_GET['to']) : "";

if ($from == "" || $to == "") {
    echo json_encode([]); 
    exit;
}

$sql = "SELECT * FROM buses 
        WHERE LOWER(from_city)='$from' 
        AND LOWER(to_city)='$to'";

$result = $conn->query($sql);

$buses = [];

while ($row = $result->fetch_assoc()) {
    $buses[] = $row;
}

echo json_encode($buses);
?>
