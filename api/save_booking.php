<?php
include "../db.php";

// Read POST data
$bus_id = $_POST['bus_id'];
$route  = $_POST['route'];
$fare   = $_POST['fare'];
$seat   = $_POST['seat'];

// Validate inputs
if (!$bus_id || !$route || !$fare || !$seat) {
    http_response_code(400);
    echo "Missing required fields";
    exit;
}

// Insert into bookings table
$stmt = $conn->prepare("INSERT INTO bookings (bus_id, seat, fare, route) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiis", $bus_id, $seat, $fare, $route);

if ($stmt->execute()) {
    echo "success";
} else {
    http_response_code(500);
    echo "Database error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
