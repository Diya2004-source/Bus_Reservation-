<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];

$sql = "
SELECT bookings.*, 
       users.name AS user_name,
       users.email,
       users.mobile,
       buses.bus_name,
       routes.from_city,
       routes.to_city,
       trips.departure_datetime,
       trips.arrival_datetime
FROM bookings
JOIN users ON bookings.user_id = users.id
JOIN trips ON bookings.trip_id = trips.id
JOIN buses ON trips.bus_id = buses.id
JOIN routes ON trips.route_id = routes.id
WHERE bookings.id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$booking) {
    die("Booking not found");
}

include 'includes/header.php';
?>

<h2>Booking Details</h2>

<table class="table table-dark table-bordered">
    <tr><th>Booking ID</th><td><?= $booking['id'] ?></td></tr>
    <tr><th>User</th><td><?= $booking['user_name'] ?></td></tr>
    <tr><th>Email</th><td><?= $booking['email'] ?></td></tr>
    <tr><th>Mobile</th><td><?= $booking['mobile'] ?></td></tr>
    <tr><th>Bus</th><td><?= $booking['bus_name'] ?></td></tr>
    <tr><th>Route</th><td><?= $booking['from_city'] ?> → <?= $booking['to_city'] ?></td></tr>
    <tr><th>Departure</th><td><?= $booking['departure_datetime'] ?></td></tr>
    <tr><th>Arrival</th><td><?= $booking['arrival_datetime'] ?></td></tr>
    <tr><th>Seat No</th><td><?= $booking['seat_no'] ?></td></tr>
    <tr><th>Amount</th><td><?= $booking['amount'] ?></td></tr>
    <tr><th>Status</th><td><?= $booking['status'] ?></td></tr>
</table>

<a href="bookings.php" class="btn btn-warning">Back</a>

<?php include 'includes/footer.php'; ?>
