<?php
include "../db.php";

$bus_id = $_GET['bus_id'];

$stmt = $conn->prepare("SELECT * FROM buses WHERE bus_id = ?");
$stmt->bind_param("i", $bus_id);
$stmt->execute();

$result = $stmt->get_result();
echo json_encode($result->fetch_assoc());
?>
