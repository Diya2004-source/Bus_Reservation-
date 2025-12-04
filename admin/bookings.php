<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

$sql = "
SELECT bookings.*, 
       users.name AS user_name,
       buses.bus_name,
       routes.from_city,
       routes.to_city,
       trips.departure_datetime
FROM bookings
JOIN users ON bookings.user_id = users.id
JOIN trips ON bookings.trip_id = trips.id
JOIN buses ON trips.bus_id = buses.id
JOIN routes ON trips.route_id = routes.id
ORDER BY bookings.id DESC
";

$result = $conn->query($sql);
?>

<h2>Bookings</h2>

<table class="table table-dark table-bordered table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>User</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Seat</th>
            <th>Amount</th>
            <th>Status</th>
            <th width="130">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($b = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $b['id'] ?></td>
            <td><?= $b['user_name'] ?></td>
            <td><?= $b['bus_name'] ?></td>
            <td><?= $b['from_city'] ?> → <?= $b['to_city'] ?></td>
            <td><?= $b['departure_datetime'] ?></td>
            <td><?= $b['seat_no'] ?></td>
            <td><?= $b['amount'] ?></td>
            <td><?= $b['status'] ?></td>
            <td>
                <a href="booking_view.php?id=<?= $b['id'] ?>" class="btn btn-sm btn-primary">View</a>
            </td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
