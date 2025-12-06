<?php
include "../db.php";

$bus_id = $_GET['bus_id'];

$bus = $conn->query("SELECT total_seats FROM buses WHERE id=$bus_id")->fetch_assoc();
$total = $bus['total_seats'];

$result = $conn->query("SELECT seat_no FROM bookings WHERE bus_id=$bus_id");

$booked = [];
while ($row = $result->fetch_assoc()) $booked[] = $row['seat_no'];

echo json_encode(["total" => $total, "booked" => $booked]);
?>
