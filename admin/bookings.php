<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

// Fetch bookings data with related info
$sql = "
SELECT b.id, b.seat_no, b.amount, b.status,
       u.name AS user_name,
       bs.bus_name,
       r.from_city, r.to_city,
       t.departure_datetime
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN trips t ON b.trip_id = t.id
JOIN buses bs ON t.bus_id = bs.id
JOIN routes r ON t.route_id = r.id
ORDER BY b.id DESC
";

$result = $conn->query($sql);
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Bookings</h2>
</div>

<table class="table table-dark table-striped table-bordered">
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
            <th width="140">Action</th>
        </tr>
    </thead>
    <tbody>
        <?php while ($b = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $b['id'] ?></td>
            <td><?= htmlspecialchars($b['user_name']) ?></td>
            <td><?= htmlspecialchars($b['bus_name']) ?></td>
            <td><?= $b['from_city'] ?> → <?= $b['to_city'] ?></td>
            <td><?= date("d M Y, h:i A", strtotime($b['departure_datetime'])) ?></td>
            <td><?= $b['seat_no'] ?></td>
            <td>₹<?= $b['amount'] ?></td>
            <td>
                <span class="badge 
                    <?= $b['status']=='Confirmed'?'bg-success': 
                       ($b['status']=='Cancelled'?'bg-danger':'bg-warning') ?>">
                    <?= $b['status'] ?>
                </span>
            </td>
            <td>
                <a href="booking_view.php?id=<?= $b['id'] ?>" class="btn btn-sm btn-primary">View</a>
                <a href="booking_delete.php?id=<?= $b['id'] ?>" 
                   class="btn btn-sm btn-danger"
                   onclick="return confirm('Delete this booking?');">
                   Delete
                </a>
            </td>
        </tr>
        <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
            