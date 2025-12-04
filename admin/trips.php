<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

$sql = "
SELECT trips.*, buses.bus_name, routes.from_city, routes.to_city
FROM trips
JOIN buses ON trips.bus_id = buses.id
JOIN routes ON trips.route_id = routes.id
ORDER BY trips.id DESC
";
$result = $conn->query($sql);
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Trips (Schedules)</h2>
    <a href="trip_add.php" class="btn btn-warning">Add New Trip</a>
</div>

<table class="table table-dark table-striped table-bordered">
    <thead>
        <tr>
            <th>ID</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Fare</th>
            <th>Status</th>
            <th width="150">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($t = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $t['id'] ?></td>
            <td><?= htmlspecialchars($t['bus_name']) ?></td>
            <td><?= $t['from_city'] ?> → <?= $t['to_city'] ?></td>
            <td><?= $t['departure_datetime'] ?></td>
            <td><?= $t['arrival_datetime'] ?></td>
            <td><?= $t['fare'] ?></td>
            <td><?= $t['status'] ?></td>
            <td>
                <a href="trip_edit.php?id=<?= $t['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                <a href="trip_delete.php?id=<?= $t['id'] ?>" class="btn btn-sm btn-danger"
                   onclick="return confirm('Delete this trip?');">Delete</a>
            </td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
