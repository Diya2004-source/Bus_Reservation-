<?php
session_start();
include "../db.php";
if (!isset($_SESSION["admin"])) header("Location: admin_login.php");

$sql = "SELECT * FROM bookings";
$res = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Bookings</title>
    <link rel="stylesheet" href="../bootstrap.min.css">
</head>

<body>
<div class="container mt-5">
    <h3>All Bookings</h3>

    <table class="table table-bordered mt-3">
        <tr>
            <th>ID</th>
            <th>Bus ID</th>
            <th>Route</th>
            <th>Seat</th>
            <th>Fare</th>
            <th>Booked Date</th>
        </tr>

        <?php while($b = $res->fetch_assoc()) { ?>
        <tr>
            <td><?= $b["id"] ?></td>
            <td><?= $b["bus_id"] ?></td>
            <td><?= $b["route"] ?></td>
            <td><?= $b["seat"] ?></td>
            <td>₹<?= $b["fare"] ?></td>
            <td><?= $b["created_at"] ?></td>
        </tr>
        <?php } ?>
    </table>
</div>
</body>
</html>
