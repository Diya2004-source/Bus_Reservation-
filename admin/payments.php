<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

// ----- SUMMARY NUMBERS -----

// Total received (paid + confirmed)
$row = $conn->query("
    SELECT SUM(amount) AS total 
    FROM bookings 
    WHERE payment_status='Paid' AND status='Confirmed'
")->fetch_assoc();
$totalReceived = $row['total'] ? (float)$row['total'] : 0;

// Pending amount (pending + confirmed)
$row = $conn->query("
    SELECT SUM(amount) AS total 
    FROM bookings 
    WHERE payment_status='Pending' AND status='Confirmed'
")->fetch_assoc();
$totalPending = $row['total'] ? (float)$row['total'] : 0;

// Count paid / pending
$row = $conn->query("
    SELECT COUNT(*) AS c 
    FROM bookings 
    WHERE payment_status='Paid'
")->fetch_assoc();
$countPaid = (int)$row['c'];

$row = $conn->query("
    SELECT COUNT(*) AS c 
    FROM bookings 
    WHERE payment_status='Pending'
")->fetch_assoc();
$countPending = (int)$row['c'];

// ----- FILTER (optional simple) -----
$statusFilter = $_GET['status'] ?? 'all';
$where = "1";

if ($statusFilter === 'paid') {
    $where = "b.payment_status='Paid'";
} elseif ($statusFilter === 'pending') {
    $where = "b.payment_status='Pending'";
}

// ----- MAIN LIST QUERY -----
$sql = "
SELECT 
  b.id,
  b.amount,
  b.payment_status,
  b.status AS booking_status,
  b.booking_date,
  u.name AS user_name,
  u.email,
  r.from_city,
  r.to_city,
  t.departure_datetime
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN trips t ON b.trip_id = t.id
JOIN routes r ON t.route_id = r.id
WHERE $where
ORDER BY b.booking_date DESC
";

$payments = $conn->query($sql);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Payments</h2>
        <p class="text-muted mb-0">View all received and pending payments.</p>
    </div>
</div>

<!-- SUMMARY CARDS -->
<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card stat-card stat-green">
            <div class="stat-label">Total Received</div>
            <div class="stat-value">₹<?= number_format($totalReceived,2) ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">
                <?= $countPaid ?> paid bookings
            </span>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card stat-card stat-orange">
            <div class="stat-label">Pending Amount</div>
            <div class="stat-value">₹<?= number_format($totalPending,2) ?></div>
            <span class="badge bg-light text-danger badge-soft mt-2">
                <?= $countPending ?> pending bookings
            </span>
        </div>
    </div>
</div>

<!-- FILTER BAR -->
<form class="row g-2 mb-3">
    <div class="col-auto">
        <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
            <option value="all"     <?= $statusFilter==='all'?'selected':''; ?>>All Payments</option>
            <option value="paid"    <?= $statusFilter==='paid'?'selected':''; ?>>Paid</option>
            <option value="pending" <?= $statusFilter==='pending'?'selected':''; ?>>Pending</option>
        </select>
    </div>
    <div class="col-auto">
        <a href="payments.php" class="btn btn-sm btn-outline-secondary">Reset</a>
    </div>
</form>

<!-- PAYMENTS TABLE -->
<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Route</th>
                        <th>Departure</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Txn ID</th>
                        <th>Payment Status</th>
                        <th>Booking Status</th>
                        <th>Booked On</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                <?php if ($payments->num_rows === 0): ?>
                    <tr>
                        <td colspan="9" class="text-center text-muted">No payments found.</td>
                    </tr>
                <?php else: ?>
                    <?php while ($p = $payments->fetch_assoc()): ?>
                        <tr>
                            <td><?= $p['id'] ?></td>
                            <td>
                                <div class="fw-semibold"><?= htmlspecialchars($p['user_name']) ?></div>
                                <small class="text-muted"><?= htmlspecialchars($p['email']) ?></small>
                            </td>
                            <td>
                                <?= $p['from_city'] ?> → <?= $p['to_city'] ?>
                            </td>
                            <td>
                                <?= $p['departure_datetime'] ?>
                            </td>
                            <td>₹<?= number_format($p['amount'],2) ?></td>

                            <td>
                            <?= $p['payment_status']=='Paid'
                            ? htmlspecialchars($p['payment_method'] ?: '—')
                            : '—'
                            ?>
                            </td>

                            <td>
                            <?= $p['payment_status']=='Paid'
                                ? htmlspecialchars($p['transaction_id'] ?: '—')
                                : '—'
                            ?>
                            </td>

                            <td>
                            <?php if ($p['payment_status']=='Paid'): ?>

                                    <span class="badge bg-success">Paid</span>
                                <?php else: ?>
                                    <span class="badge bg-warning text-dark">Pending</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($p['booking_status']=='Confirmed'): ?>
                                    <span class="badge bg-primary">Confirmed</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary">Cancelled</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?= $p['booking_date'] ?>
                            </td>
                            <td>
                                <?php if ($p['payment_status']=='Pending' && $p['booking_status']=='Confirmed'): ?>
                                    <a href="payment_status.php?id=<?= $p['id'] ?>&status=Paid"
                                       class="btn btn-sm btn-outline-success">
                                        Mark Paid
                                    </a>
                                <?php elseif ($p['payment_status']=='Paid'): ?>
                                    <a href="payment_status.php?id=<?= $p['id'] ?>&status=Pending"
                                       class="btn btn-sm btn-outline-warning">
                                        Mark Pending
                                    </a>
                                <?php else: ?>
                                    <span class="text-muted" style="font-size:.82rem;">No action</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
