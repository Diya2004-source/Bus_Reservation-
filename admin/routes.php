<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

$result = $conn->query("SELECT * FROM routes ORDER BY id DESC");
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Routes</h2>
    <a href="route_add.php" class="btn btn-warning">Add New Route</a>
</div>

<table class="table table-dark table-bordered table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>From City</th>
            <th>To City</th>
            <th>Status</th>
            <th width="150">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($r = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $r['id'] ?></td>
            <td><?= htmlspecialchars($r['from_city']) ?></td>
            <td><?= htmlspecialchars($r['to_city']) ?></td>
            <td><?= $r['status'] ?></td>
            <td>
                <a href="route_edit.php?id=<?= $r['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                <a href="route_delete.php?id=<?= $r['id'] ?>" class="btn btn-sm btn-danger"
                   onclick="return confirm('Delete this route?');">Delete</a>
            </td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
