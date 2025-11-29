//add routes
const buses = [
    { route: "Rajkot → Ahmedabad", from: "Rajkot", to: "Ahmedabad", time: "8:00 AM", fare: 350, rating: 4.5, seatsLeft: 12 },
    { route: "Rajkot → Surat", from: "Rajkot", to: "Surat", time: "6:30 AM", fare: 420, rating: 4.2, seatsLeft: 8 },
    { route: "Surat → Mumbai", from: "Surat", to: "Mumbai", time: "7:15 AM", fare: 900, rating: 4.8, seatsLeft: 5 },
     { route: "Banglore → Delhi", from: "Banglore", to: "Delhi", time: "10:30 AM", fare: 2000, rating: 4.9, seatsLeft: 3 },
      { route: "Udaipur → Rajkot", from: "Udaipur", to: "Rajkot", time: "8:00 PM", fare: 1500, rating: 4.8, seatsLeft: 5 },
       { route: "Pune → Baroda", from: "Pune", to: "Baroda", time: "6:00 PM", fare: 1000, rating: 4.5, seatsLeft: 5 },
        { route: "Rajkot → Delhi", from: "Rajkot", to: "Delhi", time: "7:30 PM", fare: 2500, rating: 4.8, seatsLeft: 10 }
];

//search bus
function searchBus() {
    const from = document.getElementById("from").value.trim().toLowerCase();
    const to = document.getElementById("to").value.trim().toLowerCase();
    const resultList = buses.filter(b => b.from.toLowerCase() === from && b.to.toLowerCase() === to);

    let output = "";
    if(resultList.length === 0){
        output = `<div class="alert alert-danger mt-3">No buses found!</div>`;
    } else {
        resultList.forEach(bus=>{
            output += `<div class="card card-custom shadow p-3 mt-3">
                <h4>${bus.route}</h4>
                <p><b>Time:</b> ${bus.time}</p>
                <p><b>Fare:</b> ₹${bus.fare}</p>
                <p><b>Rating:</b> ⭐${bus.rating}</p>
                <p><b>Seats Left:</b> ${bus.seatsLeft}</p>
                <button class="btn btn-success btn-animate" onclick="selectSeat('${bus.route}', ${bus.fare})">Book Now</button>
            </div>`;
        });
    }
    const container = document.getElementById("busList");
    if(container) container.innerHTML = output;
}

//seat selection
function selectSeat(route, fare){
    const seatNumbers = Array.from({length:10},(_,i)=>i+1);
    let html = `<div class="card card-custom p-4 mt-4 shadow">
        <h4>${route}</h4><p><b>Fare:</b> ₹${fare}</p><h5>Select Seat</h5><div class="row">`;
    seatNumbers.forEach(num=>{
        html += `<div class="col-3 p-2">
            <button class="btn btn-outline-primary w-100" onclick="goPayment('${route}',${fare},${num})">Seat ${num}</button>
        </div>`;
    });
    html += `</div></div>`;
    document.getElementById("busList").innerHTML = html;
}

//payment
function goPayment(route,fare,seat){
    const booking = { route, fare, seat };
    localStorage.setItem("user_booking", JSON.stringify(booking));
    window.location.href = "user_payment.html";
}

//qr code
function generateQRCode(){
    const booking = JSON.parse(localStorage.getItem("user_booking"));
    if(!booking) return alert("No booking data found!");

    const qrData = encodeURIComponent(`Bus: ${booking.route}\nSeat: ${booking.seat}\nFare: ₹${booking.fare}`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

    const qrDiv = document.getElementById("qrDiv");
    const qrImg = document.getElementById("qrCode");
    qrImg.src = qrCodeUrl;

    const doneBtn = document.getElementById("paymentDoneBtn");
    if(doneBtn) doneBtn.style.display = "block";

    qrDiv.style.display = "block";
}

//payment done
function paymentDone(){
    const booking = JSON.parse(localStorage.getItem("user_booking"));
    if(!booking) return alert("No booking info found!");

    const qrDiv = document.getElementById("qrDiv");
    qrDiv.innerHTML = `<h3 class="text-success">Congratulations! </h3>
        <p>Your seat has been booked successfully.</p>
        <p><b>Bus:</b> ${booking.route}</p>
        <p><b>Seat:</b> ${booking.seat}</p>
        <p><b>Fare Paid:</b> ₹${booking.fare}</p>
        <a href="user_index.html" class="btn btn-success mt-3">Back to Home</a>`;
    
    // Clear booking data
    localStorage.removeItem("user_booking");
}

//bus tracking
function moveBus(){
    const bus = document.getElementById("bus");
    if(bus){
        let currentLeft = parseInt(bus.style.left) || 20;
        let newLeft = currentLeft + Math.floor(Math.random()*50);
        if(newLeft > 300) newLeft = 20;
        bus.style.left = newLeft + "px";
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    if(window.location.pathname.includes("user_payment.html")){
        const booking = JSON.parse(localStorage.getItem("user_booking"));
        if(booking){
            const payBtn = document.querySelector(".btn-success.btn-animate");
            if(payBtn) payBtn.innerText = `Pay ₹${booking.fare}`;
        }
    }
});
