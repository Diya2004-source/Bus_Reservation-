<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM trips WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->close();

header("Location: trips.php");
exit;
?>