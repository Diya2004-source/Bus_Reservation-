<?php
include "../db.php";

$response = ['success' => false, 'error' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bus_id = $_POST['bus_id'] ?? '';
    $seats = $_POST['seats'] ?? '';
    $passenger_name = $_POST['passenger_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $from_location = $_POST['from_location'] ?? '';
    $to_location = $_POST['to_location'] ?? '';
    $travel_date = $_POST['travel_date'] ?? '';
    $upi_id = $_POST['upi_id'] ?? '';
    $status = 'pending'; // default status

    if (!$bus_id || !$seats || !$passenger_name || !$travel_date) {
        $response['error'] = "Missing required fields.";
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO bookings (bus_id, seats, passenger_name, email, phone, from_location, to_location, travel_date, upi_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssssssss", $bus_id, $seats, $passenger_name, $email, $phone, $from_location, $to_location, $travel_date, $upi_id, $status);

    if($stmt->execute()){
        $response['success'] = true;
    } else {
        $response['error'] = $stmt->error;
    }

    echo json_encode($response);
}
?>
