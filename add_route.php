<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'bus_reservation';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("INSERT INTO buses (bus_name, from_location, to_location, departure_time, arrival_time, seats_available) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssi", $data['bus_name'], $data['from_location'], $data['to_location'], $data['departure_time'], $data['arrival_time'], $data['seats_available']);

if($stmt->execute()){
    echo "Route added successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
