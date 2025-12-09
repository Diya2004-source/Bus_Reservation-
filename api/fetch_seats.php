<?php
include "../db.php";

$bus_id = $_GET['bus_id'];

$stmt = $conn->prepare("SELECT * FROM seats WHERE bus_id = ?");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

$seats = [];

while ($row = $result->fetch_assoc()) {
    $seats[] = $row;
}

echo json_encode($seats);
?>
