<?php
$conn = new mysqli("localhost", "root", "", "mega_bus");

if ($conn->connect_error) {
    die("Database connection failed!");
}
?>
