<?php
require 'includes/auth.php';
require 'includes/db.php';
include 'includes/header.php';

$result = $conn->query("SELECT * FROM buses ORDER BY id DESC");
?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Buses</h2>
    <a href="bus_add.php" class="btn btn-warning">Add New Bus</a>
</div>

<table class="table table-dark table-striped table-bordered">
    <thead>
        <tr>
            <th>ID</th>
            <th>Bus No</th>
            <th>Name</th>
            <th>Type</th>
            <th>Total Seats</th>
            <th>Status</th>
            <th width="160">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?php echo $row['id']; ?></td>
            <td><?php echo htmlspecialchars($row['bus_no']); ?></td>
            <td><?php echo htmlspecialchars($row['bus_name']); ?></td>
            <td><?php echo htmlspecialchars($row['bus_type']); ?></td>
            <td><?php echo $row['total_seats']; ?></td>
            <td><?php echo $row['status']; ?></td>
            <td>
                <a href="bus_edit.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-primary">Edit</a>
                <a href="bus_delete.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-danger"
                   onclick="return confirm('Delete this bus?');">Delete</a>
            </td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<?php include 'includes/footer.php'; ?>
