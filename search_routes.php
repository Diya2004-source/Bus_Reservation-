<?php
// Set header to JSON
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'bus_reservation';

// Connect to database
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Get 'from' and 'to' from query string and sanitize
$from = isset($_GET['from']) ? $_GET['from'] : '';
$to   = isset($_GET['to']) ? $_GET['to'] : '';

if($from === '' || $to === ''){
    echo json_encode([]);
    exit;
}

// Prepare SQL query
$stmt = $conn->prepare("SELECT * FROM bus WHERE from_location=? AND to_location=?");
$stmt->bind_param("ss", $from, $to);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all matching buses
$buses = [];
while($row = $result->fetch_assoc()){
    $buses[] = $row;
}

// Return JSON
echo json_encode($buses);

// Close connections
$stmt->close();
$conn->close();
?>
