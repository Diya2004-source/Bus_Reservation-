<?php
require 'includes/auth.php';
require 'includes/db.php';

$id = $_GET['id'];
$q = $conn->query("SELECT * FROM bookings WHERE id=$id");
$data = $q->fetch_assoc();

if (!$data) { die("Invalid Booking"); }

if ($_POST) {
    $method = $_POST['method'];
    $txn = $_POST['txn'];
    $conn->query("UPDATE bookings SET payment_method='$method', transaction_id='$txn', payment_status='Paid' WHERE id=$id");
    header("Location: payments.php");
}
include 'includes/header.php';
?>

<h3>Update Payment</h3>

<form method="post">
<label>Payment Method</label>
<select name="method" class="form-control mb-2" required>
<option value="">Select Method</option>
<option value="Card">Card</option>
<option value="UPI">UPI</option>
<option value="Net Banking">Net Banking</option>
<option value="Wallet">Wallet</option>
</select>

<label>Transaction ID</label>
<input type="text" name="txn" class="form-control mb-2" required>

<button class="btn btn-success">Save</button>
<a href="payments.php" class="btn btn-secondary">Cancel</a>
</form>

<?php include 'includes/footer.php'; ?>
