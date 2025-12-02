<?php
session_start();
include "../db.php";
if (!isset($_SESSION["admin"])) header("Location: admin_login.php");

$id = $_GET["id"];
$conn->query("DELETE FROM buses WHERE id=$id");

echo "<script>alert('Bus deleted'); window.location='view_buses.php';</script>";
