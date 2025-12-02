<?php
session_start();
include "../db.php";
if (!isset($_SESSION["admin"])) header("Location: admin_login.php");

$buses = $conn->query("SELECT * FROM buses");
?>

<!DOCTYPE html>
<html>
<head>
<title>Bus List</title>
<link rel="stylesheet" href="../bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

<style>
.table-container {
    background: #fff;
    padding: 20px;
    margin: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>

</head>
<body>

<div class="table-container">
    <h3><i class="bi bi-bus-front-fill"></i> All Buses</h3>

    <table class="table table-hover mt-3">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Time</th>
                <th>Fare</th>
                <th>Action</th>
            </tr>
        </thead>

        <?php while($b = $buses->fetch_assoc()) { ?>
        <tr>
            <td><?= $b["id"] ?></td>
            <td><?= $b["route"] ?></td>
            <td><?= $b["time"] ?></td>
            <td>₹<?= $b["fare"] ?></td>
            <td>
                <a href="edit_bus.php?id=<?= $b['id'] ?>" class="btn btn-primary btn-sm">
                    <i class="bi bi-pencil-square"></i>
                </a>

                <a href="delete_bus.php?id=<?= $b['id'] ?>" class="btn btn-danger btn-sm">
                    <i class="bi bi-trash"></i>
                </a>
            </td>
        </tr>
        <?php } ?>
    </table>
</div>

</body>
</html>
