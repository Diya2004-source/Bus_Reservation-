<?php
include "../db.php";

$busId = $_GET['bus_id'];

$sql = "SELECT * FROM seats WHERE bus_id=$busId";
$result = $conn->query($sql);

$seats = [];

while($row = $result->fetch_assoc()){
    $seats[] = $row;
}

echo json_encode($seats);
?>
