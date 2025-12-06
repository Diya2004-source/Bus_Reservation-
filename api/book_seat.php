<?php
include "../db.php";

$bus_id = $_POST['bus_id'];
$seat = $_POST['seat'];

$conn->query("INSERT INTO bookings(bus_id, seat_no) VALUES('$bus_id', '$seat')");

echo "success";
?>
