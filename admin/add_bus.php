<?php
session_start();
include "../db.php";
if (!isset($_SESSION["admin"])) header("Location: admin_login.php");

if(isset($_POST["add"])) {
    $route = $_POST["route"];
    $time = $_POST["time"];
    $fare = $_POST["fare"];

    $conn->query("INSERT INTO buses(route,time,fare) VALUES('$route','$time','$fare')");
    echo "<script>alert('Bus Added Successfully'); window.location='view_buses.php';</script>";
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Add Bus</title>
<link rel="stylesheet" href="../bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

<style>
.form-box {
    max-width: 500px;
    margin: 40px auto;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
</style>

</head>
<body>

<div class="form-box">
    <h3 class="text-center"><i class="bi bi-bus-front"></i> Add New Bus</h3>
    <form method="POST">
        <input type="text" name="route" class="form-control mt-3" placeholder="Route" required>
        <input type="time" name="time" class="form-control mt-3" required>
        <input type="number" name="fare" class="form-control mt-3" placeholder="Fare ₹" required>

        <button name="add" class="btn btn-primary w-100 mt-3">
            Add Bus <i class="bi bi-check-circle"></i>
        </button>
    </form>
</div>

</body>
</html>
