<?php
include "../db.php";

$id = $_GET['bus_id'];
$res = $conn->query("SELECT * FROM buses WHERE id=$id");

echo json_encode($res->fetch_assoc());
?>
