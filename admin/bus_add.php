<?php
require 'includes/auth.php';
require 'includes/db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bus_no      = trim($_POST['bus_no'] ?? '');
    $bus_name    = trim($_POST['bus_name'] ?? '');
    $bus_type    = trim($_POST['bus_type'] ?? '');
    $total_seats = (int)($_POST['total_seats'] ?? 0);
    $status      = $_POST['status'] ?? 'Active';

    if ($bus_no === '' || $bus_name === '' || $bus_type === '' || $total_seats <= 0) {
        $errors[] = "All fields are required and total seats must be > 0";
    }

    if (!$errors) {
        $stmt = $conn->prepare(
            "INSERT INTO buses (bus_no, bus_name, bus_type, total_seats, status)
             VALUES (?, ?, ?, ?, ?)"
        );
        // s = string, i = integer
        $stmt->bind_param("sssis", $bus_no, $bus_name, $bus_type, $total_seats, $status);
        $stmt->execute();
        $stmt->close();

        header('Location: buses.php');
        exit;
    }
}

include 'includes/header.php';
?>

<h2 class="mb-3">Add New Bus</h2>

<?php foreach ($errors as $e): ?>
    <div class="alert alert-danger py-1"><?php echo htmlspecialchars($e); ?></div>
<?php endforeach; ?>

<form method="post">
    <div class="mb-3">
        <label class="form-label">Bus Number</label>
        <input type="text" name="bus_no" class="form-control" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Bus Name</label>
        <input type="text" name="bus_name" class="form-control" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Bus Type</label>
        <input type="text" name="bus_type" class="form-control" placeholder="AC / Non-AC / Sleeper" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Total Seats</label>
        <input type="number" name="total_seats" class="form-control" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Status</label>
        <select name="status" class="form-select">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select>
    </div>

    <button type="submit" class="btn btn-warning">Save</button>
    <a href="buses.php" class="btn btn-secondary">Cancel</a>
</form>

<?php include 'includes/footer.php'; ?>
