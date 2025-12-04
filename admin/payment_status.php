<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$status = $_GET['status'] ?? '';

$allowed = ['Paid','Pending'];

if ($id > 0 && in_array($status, $allowed, true)) {
    $stmt = $conn->prepare("UPDATE bookings SET payment_status=? WHERE id=?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
    $stmt->close();
}

header("Location: payments.php");
exit;

