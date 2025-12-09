<?php
// db.php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "make_trip";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}
?>
