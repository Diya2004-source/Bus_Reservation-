<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM trips WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$trip = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$trip) {
    die("Trip not found");
}

$buses = $conn->query("SELECT id, bus_name FROM buses WHERE status='Active'");
$routes = $conn->query("SELECT id, from_city, to_city FROM routes WHERE status='Active'");

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $bus_id = $_POST['bus_id'];
    $route_id = $_POST['route_id'];
    $departure = $_POST['departure_datetime'];
    $arrival = $_POST['arrival_datetime'];
    $fare = $_POST['fare'];
    $status = $_POST['status'];

    if (!$errors) {
        $stmt = $conn->prepare("UPDATE trips SET bus_id=?, route_id=?, departure_datetime=?, arrival_datetime=?, fare=?, status=? WHERE id=?");
        $stmt->bind_param("iissdsi", $bus_id, $route_id, $departure, $arrival, $fare, $status, $id);
        $stmt->execute();
        $stmt->close();

        header("Location: trips.php");
        exit;
    }
}

include 'includes/header.php';
?>

<h2>Edit Trip</h2>

<form method="post">

    <div class="mb-3">
        <label>Bus</label>
        <select name="bus_id" class="form-select">
            <?php while ($b = $buses->fetch_assoc()): ?>
                <option value="<?= $b['id'] ?>" <?= $trip['bus_id']==$b['id']?'selected':'' ?>>
                    <?= $b['bus_name'] ?>
                </option>
            <?php endwhile; ?>
        </select>
    </div>

    <div class="mb-3">
        <label>Route</label>
        <select name="route_id" class="form-select">
            <?php while ($r = $routes->fetch_assoc()): ?>
                <option value="<?= $r['id'] ?>" <?= $trip['route_id']==$r['id']?'selected':'' ?>>
                    <?= $r['from_city'] ?> → <?= $r['to_city'] ?>
                </option>
            <?php endwhile; ?>
        </select>
    </div>

    <div class="mb-3">
        <label>Departure</label>
        <input type="datetime-local" name="departure_datetime" class="form-control"
               value="<?= date('Y-m-d\TH:i', strtotime($trip['departure_datetime'])) ?>">
    </div>

    <div class="mb-3">
        <label>Arrival</label>
        <input type="datetime-local" name="arrival_datetime" class="form-control"
               value="<?= date('Y-m-d\TH:i', strtotime($trip['arrival_datetime'])) ?>">
    </div>

    <div class="mb-3">
        <label>Fare</label>
        <input type="number" name="fare" value="<?= $trip['fare'] ?>" class="form-control">
    </div>

    <div class="mb-3">
        <label>Status</label>
        <select name="status" class="form-select">
            <option value="Active" <?= $trip['status']=='Active'?'selected':'' ?>>Active</option>
            <option value="Inactive" <?= $trip['status']=='Inactive'?'selected':'' ?>>Inactive</option>
        </select>
    </div>

    <button class="btn btn-warning">Update</button>
</form>

<?php include 'includes/footer.php'; ?>
