<?php
$conn = new mysqli("localhost", "root", "", "bus_reservation");

if ($conn->connect_error) {
    die("Database connection failed!");
}
?>
