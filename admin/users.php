<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

$result = $conn->query("SELECT * FROM users ORDER BY id DESC");
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Users</h2>
</div>

<table class="table table-dark table-bordered table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th width="180">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($u = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $u['id'] ?></td>
            <td><?= htmlspecialchars($u['name']) ?></td>
            <td><?= htmlspecialchars($u['email']) ?></td>
            <td><?= htmlspecialchars($u['mobile']) ?></td>
            <td><?= $u['status'] ?></td>
            <td>
                <a href="user_view.php?id=<?= $u['id'] ?>" class="btn btn-sm btn-primary">View</a>

                <?php if ($u['status']=='Active'): ?>
                    <a href="user_status.php?id=<?= $u['id'] ?>&status=Blocked" class="btn btn-sm btn-warning">Block</a>
                <?php else: ?>
                    <a href="user_status.php?id=<?= $u['id'] ?>&status=Active" class="btn btn-sm btn-success">Unblock</a>
                <?php endif; ?>
            </td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
