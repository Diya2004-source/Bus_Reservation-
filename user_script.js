// SEARCH BUS FUNCTION
function searchBus() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    const result = `
        <div class="card card-custom shadow p-3 mt-3">
            <h4>${from} ➝ ${to}</h4>
            <p><b>Bus Name:</b> Royal Express</p>
            <p><b>Time:</b> 8:00 AM</p>
            <p><b>Fare:</b> ₹350</p>
            <a href="user_booking.html" class="btn btn-success btn-animate">Book Now</a>
        </div>
    `;

    document.getElementById("result").innerHTML = result;
}

// SHOW QR ON BOOKING PAGE
function showQR() {
    document.getElementById("qr").style.display = "block";
}

// PAYMENT SUCCESS
function payNow() {
    document.getElementById("msg").innerHTML = "Payment Successful ✔";
}

// BUS TRACKING SIMULATION
let busPosition = 20;

function moveBus() {
    busPosition += 40;
    document.getElementById("bus").style.left = busPosition + "px";
}
