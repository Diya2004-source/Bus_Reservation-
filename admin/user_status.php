<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];
$status = $_GET['status'];

$stmt = $conn->prepare("UPDATE users SET status=? WHERE id=?");
$stmt->bind_param("si", $status, $id);
$stmt->execute();
$stmt->close();

header("Location: users.php");
exit;
?>