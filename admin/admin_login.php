<?php
session_start();
include "../db.php";

if (isset($_POST["login"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM admin WHERE username='$username' AND password='$password'";
    $res = $conn->query($sql);

    if ($res->num_rows > 0) {
        $_SESSION["admin"] = $username;
        header("Location: admin_dashboard.php");
    } else {
        $error = "Invalid login!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Login</title>
    <link rel="stylesheet" href="../bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <style>
        body {
            background: url('../images/admin_bg.jpg') no-repeat center center/cover;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            width: 350px;
        }
        .login-box h3 {
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>

<body>

<div class="login-box">
    <h3><i class="bi bi-person-lock"></i> Admin Login</h3>

    <?php if(isset($error)) echo "<p class='text-danger text-center mt-2'>$error</p>"; ?>

    <form method="POST">
        <input type="text" name="username" class="form-control mt-3" placeholder="Username" required>
        <input type="password" name="password" class="form-control mt-3" placeholder="Password" required>
        <button class="btn btn-dark w-100 mt-3" name="login">
            Login <i class="bi bi-box-arrow-in-right"></i>
        </button>
    </form>
</div>

</body>
</html>
