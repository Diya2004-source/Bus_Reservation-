<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM routes WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$route = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$route) {
    die("Route not found");
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $from = trim($_POST['from_city']);
    $to = trim($_POST['to_city']);
    $status = $_POST['status'];

    if ($from === '' || $to === '') {
        $errors[] = "All fields required.";
    }

    if (!$errors) {
        $stmt = $conn->prepare("UPDATE routes SET from_city=?, to_city=?, status=? WHERE id=?");
        $stmt->bind_param("sssi", $from, $to, $status, $id);
        $stmt->execute();
        $stmt->close();

        header("Location: routes.php");
        exit;
    }
}

include 'includes/header.php';
?>

<h2>Edit Route</h2>

<?php foreach ($errors as $e): ?>
    <div class="alert alert-danger"><?= $e ?></div>
<?php endforeach; ?>

<form method="post">
    <div class="mb-3">
        <label>From City</label>
        <input type="text" class="form-control" name="from_city" value="<?= $route['from_city'] ?>">
    </div>

    <div class="mb-3">
        <label>To City</label>
        <input type="text" class="form-control" name="to_city" value="<?= $route['to_city'] ?>">
    </div>

    <div class="mb-3">
        <label>Status</label>
        <select name="status" class="form-select">
            <option value="Active" <?= $route['status']=='Active'?'selected':'' ?>>Active</option>
            <option value="Inactive" <?= $route['status']=='Inactive'?'selected':'' ?>>Inactive</option>
        </select>
    </div>

    <button class="btn btn-warning">Update</button>
</form>

<?php include 'includes/footer.php'; ?>
