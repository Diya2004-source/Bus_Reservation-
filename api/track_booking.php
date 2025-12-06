<?php
header("Content-Type: application/json");
include "../db.php";

$bid = isset($_GET['booking_id']) ? (int)$_GET['booking_id'] : 0;
if(!$bid){ echo json_encode(["error"=>"booking_id required"]); exit; }

$stmt = $conn->prepare("SELECT * FROM bookings WHERE booking_id = ?");
$stmt->bind_param("i", $bid);
$stmt->execute();
$res = $stmt->get_result();
if($res->num_rows == 0){ echo json_encode(["error"=>"Not found"]); exit; }
$row = $res->fetch_assoc();

// get seats for that booking
$stmt2 = $conn->prepare("SELECT seat_no FROM seats WHERE booking_id = ?");
$stmt2->bind_param("i", $bid);
$stmt2->execute();
$r2 = $stmt2->get_result();
$seatArr = [];
while($rr = $r2->fetch_assoc()) $seatArr[] = $rr['seat_no'];

$row['seats'] = implode(", ", $seatArr);
echo json_encode($row);
