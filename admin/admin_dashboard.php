<?php
session_start();
if (!isset($_SESSION["admin"])) header("Location: admin_login.php");
?>

<!DOCTYPE html>
<html>
<head>
<title>Admin Dashboard</title>
<link rel="stylesheet" href="../bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

<style>
body {
    display: flex;
    background: #f0f2f5;
}

.sidebar {
    width: 250px;
    background: #212529;
    color: #fff;
    height: 100vh;
    padding-top: 30px;
    position: fixed;
}

.sidebar a {
    display: block;
    padding: 14px 25px;
    color: #ddd;
    text-decoration: none;
    font-size: 17px;
}

.sidebar a:hover {
    background: #343a40;
    color: #fff;
}

.content {
    margin-left: 270px;
    padding: 40px;
    width: 100%;
}

.card-box {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    text-align: center;
}
.card-box h2 {
    font-size: 42px;
    color: #0d6efd;
}
</style>
</head>

<body>

<div class="sidebar">
    <h3 class="text-center mb-4">🚌 Admin Panel</h3>
    <a href="admin_dashboard.php"><i class="bi bi-speedometer2"></i> Dashboard</a>
    <a href="add_bus.php"><i class="bi bi-plus-circle"></i> Add Bus</a>
    <a href="view_buses.php"><i class="bi bi-bus-front"></i> Manage Buses</a>
    <a href="bookings.php"><i class="bi bi-receipt"></i> View Bookings</a>
    <a href="logout.php"><i class="bi bi-box-arrow-right"></i> Logout</a>
</div>

<div class="content">
    <h2>Welcome, Admin 👋</h2>
    <hr>

    <div class="row mt-4">
        <div class="col-md-4">
            <div class="card-box">
                <i class="bi bi-bus-front" style="font-size: 40px;"></i>
                <h2>25</h2>
                <p>Total Buses</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card-box">
                <i class="bi bi-person-check" style="font-size: 40px;"></i>
                <h2>120</h2>
                <p>Total Bookings</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card-box">
                <i class="bi bi-people" style="font-size: 40px;"></i>
                <h2>85</h2>
                <p>Registered Users</p>
            </div>
        </div>
    </div>
</div>

</body>
</html>
