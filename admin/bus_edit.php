<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = (int)($_GET['id'] ?? 0);

// existing bus fetch karo
$stmt = $conn->prepare("SELECT * FROM buses WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$bus = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$bus) {
    die("Bus not found");
}

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
            "UPDATE buses
             SET bus_no = ?, bus_name = ?, bus_type = ?, total_seats = ?, status = ?
             WHERE id = ?"
        );
        $stmt->bind_param("sssisi", $bus_no, $bus_name, $bus_type, $total_seats, $status, $id);
        $stmt->execute();
        $stmt->close();

        header('Location: buses.php');
        exit;
    }
}

include 'includes/header.php';
?>

<h2 class="mb-3">Edit Bus</h2>

<?php foreach ($errors as $e): ?>
    <div class="alert alert-danger py-1"><?php echo htmlspecialchars($e); ?></div>
<?php endforeach; ?>

<form method="post">
    <div class="mb-3">
        <label class="form-label">Bus Number</label>
        <input type="text" name="bus_no" class="form-control"
               value="<?php echo htmlspecialchars($bus['bus_no']); ?>" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Bus Name</label>
        <input type="text" name="bus_name" class="form-control"
               value="<?php echo htmlspecialchars($bus['bus_name']); ?>" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Bus Type</label>
        <input type="text" name="bus_type" class="form-control"
               value="<?php echo htmlspecialchars($bus['bus_type']); ?>" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Total Seats</label>
        <input type="number" name="total_seats" class="form-control"
               value="<?php echo $bus['total_seats']; ?>" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Status</label>
        <select name="status" class="form-select">
            <option value="Active"   <?php if ($bus['status'] === 'Active')   echo 'selected'; ?>>Active</option>
            <option value="Inactive" <?php if ($bus['status'] === 'Inactive') echo 'selected'; ?>>Inactive</option>
        </select>
    </div>

    <button type="submit" class="btn btn-warning">Update</button>
    <a href="buses.php" class="btn btn-secondary">Cancel</a>
</form>

<?php include 'includes/footer.php'; ?>
