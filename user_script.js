<<<<<<< HEAD
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
=======
// SEARCH BUS
function searchBus() {
    const from = $("#from").val().trim();
    const to = $("#to").val().trim();
    const date = $("#travelDate").val();

    if (!from || !to || !date) {
        alert("Please enter From, To, and Travel Date.");
        return;
    }

    // Prevent past dates
    const today = new Date().toISOString().split('T')[0];
    if(date < today){
        alert("Please select a valid travel date.");
        return;
    }

    $.ajax({
        url: "api/search_bus.php",
        type: "GET",
        data: { from, to, date },
        success: function (res) {
            const buses = JSON.parse(res);
            let html = "";

            if (buses.length === 0) {
                html = "<h3 class='text-center mt-3'>No buses found</h3>";
            } else {
                buses.forEach(bus => {
                    html += `
                        <div class='card p-3 mt-3'>
                            <h4>${bus.route}</h4>
                            <p>Time: ${bus.time}</p>
                            <p>Fare: ₹${bus.fare}</p>
                            <button class="btn btn-primary book-btn" 
                                data-id="${bus.id}" 
                                data-route='${bus.route}' 
                                data-fare='${bus.fare}'>
                                Book
                            </button>
                        </div>`;
                });
            }

            $("#busList").html(html);
            $("#seatArea").html("");
        },
        error: function () {
            alert("Error fetching buses. Try again.");
        }
    });
}

// OPEN SEATS
$(document).on("click", ".book-btn", function () {
    const busId = $(this).data("id");
    const route = $(this).data("route");
    const fare = $(this).data("fare");

    localStorage.setItem("booking_busId", busId);
    localStorage.setItem("booking_route", route);
    localStorage.setItem("booking_fare", fare);

    $.ajax({
        url: "api/get_seats.php",
        type: "GET",
        data: { bus_id: busId },
        success: function (res) {
            const bookedSeats = JSON.parse(res).map(s => s.seat);
            let html = "<h3 class='text-center mt-3'>Select Your Seat</h3><div class='mt-3 text-center'>";

            for (let i = 1; i <= 30; i++) {
                const disabled = bookedSeats.includes(i.toString()) ? "disabled" : "";
                const colorClass = bookedSeats.includes(i.toString()) ? "btn-secondary" : "btn-outline-dark";
                html += `<button class="seat-btn btn ${colorClass} m-2" data-seat="${i}" ${disabled}>Seat ${i}</button>`;
            }

            html += "</div><div id='selectedSeat' class='mt-3 text-center'></div>";
            $("#seatArea").html(html);
            $("#busList").html("");
        },
        error: function () {
            alert("Error fetching seats. Please try again.");
        }
    });
});

// SELECT SEAT
$(document).on("click", ".seat-btn", function () {
    $(".seat-btn").removeClass("btn-warning");
    $(this).addClass("btn-warning");

    const seat = $(this).data("seat");
    localStorage.setItem("booking_seat", seat);

    $("#selectedSeat").html(`
        <div class="alert alert-success">
            You selected <b>Seat ${seat}</b>
        </div>
        <button id="payNow" class="btn btn-success mt-2">Proceed to Payment</button>
    `);
});

// GO TO PAYMENT PAGE
$(document).on("click", "#payNow", function () {
    window.location.href = "user_payment.html";
});

// PAYMENT PAGE LOGIC
$(document).ready(function () {
    if (window.location.pathname.includes("user_payment.html")) {
        const fare = localStorage.getItem("booking_fare");
        $("#payBtn").text(`Pay ₹${fare}`);
        $("#paymentSection").hide();
        $("#paymentDoneBtn").hide();

        $("#payBtn").click(function () {
            const name = $("#cardName").val().trim();
            if (!name) { alert("Enter your name!"); return; }

            const bookingData = {
                busId: localStorage.getItem("booking_busId"),
                route: localStorage.getItem("booking_route"),
                seat: localStorage.getItem("booking_seat"),
                fare: localStorage.getItem("booking_fare")
            };

            // SHOW QR CODE
            $("#paymentSection").show();
            $("#qrCode").html(""); // clear previous QR
            new QRCode(document.getElementById("qrCode"), {
                text: JSON.stringify(bookingData),
                width: 260,
                height: 260,
                colorDark: "#000000",
                colorLight: "#ffffff"
            });
            $("#paymentDoneBtn").show();
            $("#payBtn").prop("disabled", true).text("Scan QR or Pay Online");

        
            if("YOUR_RAZORPAY_KEY" !== "" && !isNaN(parseFloat(bookingData.fare))){
                var options = {
                    "key": "YOUR_RAZORPAY_KEY", // replace with your actual key
                    "amount": parseFloat(bookingData.fare) * 100,
                    "currency": "INR",
                    "name": "Bus Reservation",
                    "description": `Booking for Seat ${bookingData.seat} - ${bookingData.route}`,
                    "handler": function (response){
                        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                        saveBooking();
                    },
                    "prefill": { "name": name },
                    "theme": { "color": "#3399cc" }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            } else {
                console.log("Razorpay not initialized. Using QR payment only.");
            }
        });
    }
});

// =======================
// SAVE BOOKING
// =======================
function saveBooking() {
    $.ajax({
        url: "api/save_booking.php",
        type: "POST",
        data: {
            bus_id: localStorage.getItem("booking_busId"),
            route: localStorage.getItem("booking_route"),
            fare: localStorage.getItem("booking_fare"),
            seat: localStorage.getItem("booking_seat")
        },
        success: function () {
            alert("Booking successful!");
            localStorage.clear();
            window.location.href = "user_index.html";
        },
        error: function(xhr){
            console.error(xhr.responseText);
            alert("Error processing booking.");
        }
    });
}

$(document).on("click", "#paymentDoneBtn", function () {
    saveBooking();
});
>>>>>>> d866568d2ac6c203a713d8756141cc26e9771b76
