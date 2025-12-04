<?php
require 'includes/auth.php';
require 'includes/db.php';

// fetch buses
$buses = $conn->query("SELECT id, bus_name FROM buses WHERE status='Active' ORDER BY bus_name");

// fetch routes
$routes = $conn->query("SELECT id, from_city, to_city FROM routes WHERE status='Active'");

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $bus_id = $_POST['bus_id'];
    $route_id = $_POST['route_id'];
    $departure = $_POST['departure_datetime'];
    $arrival = $_POST['arrival_datetime'];
    $fare = $_POST['fare'];
    $status = $_POST['status'];

    if ($fare <= 0) {
        $errors[] = "Fare must be greater than 0";
    }

    if (!$errors) {
        $stmt = $conn->prepare("INSERT INTO trips (bus_id, route_id, departure_datetime, arrival_datetime, fare, status)
                                VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissds", $bus_id, $route_id, $departure, $arrival, $fare, $status);
        $stmt->execute();
        $stmt->close();

        header("Location: trips.php");
        exit;
    }
}

include 'includes/header.php';
?>

<h2>Add New Trip</h2>

<?php foreach ($errors as $e): ?>
    <div class="alert alert-danger"><?= $e ?></div>
<?php endforeach; ?>

<form method="post">

    <div class="mb-3">
        <label>Bus</label>
        <select name="bus_id" class="form-select" required>
            <option value="">Select Bus</option>
            <?php while ($b = $buses->fetch_assoc()): ?>
                <option value="<?= $b['id'] ?>"><?= $b['bus_name'] ?></option>
            <?php endwhile; ?>
        </select>
    </div>

    <div class="mb-3">
        <label>Route</label>
        <select name="route_id" class="form-select" required>
            <option value="">Select Route</option>
            <?php while ($r = $routes->fetch_assoc()): ?>
                <option value="<?= $r['id'] ?>"><?= $r['from_city'] ?> → <?= $r['to_city'] ?></option>
            <?php endwhile; ?>
        </select>
    </div>

    <div class="mb-3">
        <label>Departure Date & Time</label>
        <input type="datetime-local" name="departure_datetime" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Arrival Date & Time</label>
        <input type="datetime-local" name="arrival_datetime" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Fare (₹)</label>
        <input type="number" name="fare" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Status</label>
        <select name="status" class="form-select">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select>
    </div>

    <button class="btn btn-warning">Save</button>
</form>

<?php include 'includes/footer.php'; ?>
