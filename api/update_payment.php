<?php
$conn = new mysqli("localhost", "root", "", "make_trip");
if($conn->connect_error) die("Connection failed: ".$conn->connect_error);

$booking_id = $_POST['booking_id'] ?? '';
$name = $_POST['passenger_name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$payment_mode = $_POST['payment_mode'] ?? '';

if($booking_id && $name && $email && $phone && $payment_mode){
    $stmt = $conn->prepare("UPDATE bookings SET passenger_name=?, email=?, phone=?, payment_status='paid', payment_mode=? WHERE booking_id=?");
    $stmt->bind_param("ssssi", $name, $email, $phone, $payment_mode, $booking_id);
    echo $stmt->execute() ? "success" : "Error: ".$stmt->error;
    $stmt->close();
} else {
    echo "All fields required!";
}
$conn->close();
?>
