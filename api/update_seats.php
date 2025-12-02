<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$seat = $data["seat"];
$bus_id = $data["bus_id"];

$conn->query("UPDATE seats SET is_booked=1 WHERE bus_id=$bus_id AND seat_no=$seat");

echo "success";
?>
