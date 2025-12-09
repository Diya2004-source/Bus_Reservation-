<?php
include "../db.php";

$from = $_GET['from'];
$to   = $_GET['to'];

$stmt = $conn->prepare("SELECT * FROM buses WHERE pickup = ? AND drop_location = ?");
$stmt->bind_param("ss", $from, $to);
$stmt->execute();
$result = $stmt->get_result();

$buses = [];
while ($row = $result->fetch_assoc()) {
    $buses[] = $row;
}

echo json_encode($buses);
?>
