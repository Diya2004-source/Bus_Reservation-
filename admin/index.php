<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

// ====== DASHBOARD NUMBERS ======

// total buses
$busRow = $conn->query("SELECT COUNT(*) AS c FROM buses")->fetch_assoc();
$totalBuses = (int)$busRow['c'];

// active routes
$routeRow = $conn->query("SELECT COUNT(*) AS c FROM routes WHERE status='Active'")->fetch_assoc();
$activeRoutes = (int)$routeRow['c'];

// today's bookings
$todayRow = $conn->query("SELECT COUNT(*) AS c FROM bookings WHERE DATE(booking_date)=CURDATE()")->fetch_assoc();
$todaysBookings = (int)$todayRow['c'];

// total users
$userRow = $conn->query("SELECT COUNT(*) AS c FROM users WHERE status='Active'")->fetch_assoc();
$totalUsers = (int)$userRow['c'];

// total revenue
$revRow = $conn->query("
    SELECT SUM(amount) AS s 
    FROM bookings 
    WHERE status='Confirmed' AND payment_status='Paid'
")->fetch_assoc();
$totalRevenue = $revRow['s'] ? (float)$revRow['s'] : 0;

// ====== RECENT BOOKINGS (last 5) ======
$recentSql = "
SELECT b.id, b.amount, b.seat_no, b.booking_date,
       u.name AS user_name,
       r.from_city, r.to_city
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN trips t ON b.trip_id = t.id
JOIN routes r ON t.route_id = r.id
ORDER BY b.booking_date DESC
LIMIT 5
";
$recentBookings = $conn->query($recentSql);

// ====== MONTHLY BOOKINGS DATA (simple dynamic) ======
$monthData = array_fill(1, 12, 0);
$monthlyRes = $conn->query("
    SELECT MONTH(booking_date) AS m, COUNT(*) AS c
    FROM bookings
    WHERE YEAR(booking_date) = YEAR(CURDATE())
    GROUP BY MONTH(booking_date)
");
while ($row = $monthlyRes->fetch_assoc()) {
    $monthData[(int)$row['m']] = (int)$row['c'];
}
$jsMonthly = json_encode(array_values($monthData));
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Welcome back, Admin!</h2>
        <p class="text-muted mb-0">Here's what's happening with your bus system today.</p>
    </div>
    <a href="bus_add.php" class="btn btn-primary rounded-pill">
        <i class="fa-solid fa-plus me-1"></i> Add New Bus
    </a>
</div>

<!-- TOP STATS ROW -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card stat-card stat-blue">
            <div class="stat-label">Total Buses</div>
            <div class="stat-value"><?= $totalBuses ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">+2.5% this month</span>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stat-card stat-purple">
            <div class="stat-label">Active Routes</div>
            <div class="stat-value"><?= $activeRoutes ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">+1.2% this month</span>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stat-card stat-green">
            <div class="stat-label">Today's Bookings</div>
            <div class="stat-value"><?= $todaysBookings ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">+15% vs yesterday</span>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card stat-card stat-orange">
            <div class="stat-label">Total Users</div>
            <div class="stat-value"><?= $totalUsers ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">+8.0% this month</span>
        </div>
    </div>
</div>

<!-- REVENUE CARD -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card stat-card stat-pink">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">₹<?= number_format($totalRevenue,2) ?></div>
            <span class="badge bg-light text-success badge-soft mt-2">+5.3% this month</span>
        </div>
    </div>
</div>

<!-- CHART + RECENT BOOKINGS -->
<div class="row g-4">
    <div class="col-md-8">
        <div class="card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <h5 class="card-title mb-0">Monthly Bookings</h5>
                        <small class="text-muted">Overview of booking trends.</small>
                    </div>
                    <span class="text-success fw-semibold" style="font-size:.9rem;">+11.2% ↑</span>
                </div>
                <canvas id="bookingsChart" height="120"></canvas>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title mb-3">Recent Bookings</h5>

                <?php if ($recentBookings->num_rows === 0): ?>
                    <p class="text-muted mb-0">No bookings yet.</p>
                <?php else: ?>
                    <div class="list-group list-group-flush">
                        <?php
                        $colors = ['chip-blue','chip-green','chip-purple','chip-orange'];
                        $i = 0;
                        while ($b = $recentBookings->fetch_assoc()):
                            $colorClass = $colors[$i % count($colors)];
                            $i++;
                        ?>
                        <div class="list-group-item d-flex align-items-center px-0">
                            <div class="chip-icon <?= $colorClass ?> me-3">
                                <i class="fa-solid fa-ticket"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="fw-semibold">Booking #<?= $b['id'] ?></div>
                                <small class="text-muted">
                                    <?= htmlspecialchars($b['user_name']) ?>
                                    – <?= $b['from_city'] ?> → <?= $b['to_city'] ?>
                                </small>
                            </div>
                            <div class="text-success fw-semibold">
                                +₹<?= number_format($b['amount'],2) ?>
                            </div>
                        </div>
                        <?php endwhile; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<script>
// Chart.js – monthly bookings
const monthlyData = <?= $jsMonthly ?>;
const ctx = document.getElementById('bookingsChart');

if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Bookings',
                data: monthlyData,
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            plugins: { legend: { display:false } },
            scales: {
                y: { beginAtZero:true, ticks:{ stepSize:1 } }
            }
        }
    });
}
</script>

<?php include 'includes/footer.php'; ?>
