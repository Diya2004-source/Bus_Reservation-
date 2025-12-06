<?php
include "../db.php";

$bus_id = isset($_GET['bus_id']) ? intval($_GET['bus_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

if($bus_id && $date){
    $stmt = $conn->prepare("SELECT seat_no FROM bookings WHERE bus_id = ? AND travel_date = ?");
    $stmt->bind_param("is", $bus_id, $date);
    $stmt->execute();
    $result = $stmt->get_result();
    $seats = [];
    while($row = $result->fetch_assoc()){
        $seats[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($seats);
} else {
    echo json_encode([]);
}
?>
