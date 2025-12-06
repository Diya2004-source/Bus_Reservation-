<?php
$host = 'localhost';
$user = 'root';
$pass = '';  // XAMPP ma mostly empty
$dbname = 'bus_reservation';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
