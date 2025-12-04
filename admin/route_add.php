<?php
require 'includes/auth.php';
require 'includes/db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $from = trim($_POST['from_city']);
    $to   = trim($_POST['to_city']);
    $status = $_POST['status'];

    if ($from === '' || $to === '') {
        $errors[] = "All fields are required.";
    }

    if (!$errors) {
        $stmt = $conn->prepare("INSERT INTO routes (from_city, to_city, status) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $from, $to, $status);
        $stmt->execute();
        $stmt->close();

        header('Location: routes.php');
        exit;
    }
}

include 'includes/header.php';
?>

<h2>Add New Route</h2>

<?php foreach ($errors as $e): ?>
    <div class="alert alert-danger py-1"><?= $e ?></div>
<?php endforeach; ?>

<form method="post">
    <div class="mb-3">
        <label>From City</label>
        <input type="text" name="from_city" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>To City</label>
        <input type="text" name="to_city" class="form-control" required>
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
