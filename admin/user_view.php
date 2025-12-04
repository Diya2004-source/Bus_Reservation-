<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user) {
    die("User not found");
}

include 'includes/header.php';
?>

<h2>User Details</h2>

<table class="table table-dark table-bordered">
    <tr><th>ID</th><td><?= $user['id'] ?></td></tr>
    <tr><th>Name</th><td><?= $user['name'] ?></td></tr>
    <tr><th>Email</th><td><?= $user['email'] ?></td></tr>
    <tr><th>Mobile</th><td><?= $user['mobile'] ?></td></tr>
    <tr><th>Status</th><td><?= $user['status'] ?></td></tr>
    <tr><th>Created At</th><td><?= $user['created_at'] ?></td></tr>
</table>

<a href="users.php" class="btn btn-warning">Back</a>

<?php include 'includes/footer.php'; ?>
