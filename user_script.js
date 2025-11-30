// =======================
// SEARCH BUS
// =======================
function searchBus() {
    const from = $("#from").val();
    const to = $("#to").val();

    $.ajax({
        url: "api/search_bus.php",
        type: "GET",
        data: { from: from, to: to },
        success: function (res) {
            const buses = JSON.parse(res);
            let html = "";

            if (buses.length === 0) {
                html = "<h3>No buses found</h3>";
            } else {
                buses.forEach(bus => {
                    html += `
                    <div class='card p-3 mt-3'>
                        <h4>${bus.route}</h4>
                        <p>Time: ${bus.time}</p>
                        <p>Fare: ₹${bus.fare}</p>
                        <button class="btn btn-primary" 
                                onclick="openSeats(${bus.id}, '${bus.route}', ${bus.fare})">
                            Book
                        </button>
                    </div>`;
                });
            }

            $("#busList").html(html);
        }
    });
}

// =======================
// FETCH SEATS
// =======================
function openSeats(bus_id, route, fare) {
    localStorage.setItem("booking_busId", bus_id);
    localStorage.setItem("booking_route", route);
    localStorage.setItem("booking_fare", fare);

    $.ajax({
        url: "api/get_seats.php",
        type: "GET",
        data: { bus_id: bus_id },
        success: function (res) {
            const seats = JSON.parse(res);
            let html = `<h3>Select Your Seat</h3><div class="row">`;

            seats.forEach(s => {
                html += `
                <button 
                    class="btn ${s.is_booked == 1 ? 'btn-danger' : 'btn-primary'} m-2 seat-btn"
                    onclick="selectSeat(${s.seat_no})"
                    ${s.is_booked == 1 ? 'disabled' : ''}>
                    Seat ${s.seat_no}
                </button>`;
            });

            html += "</div>";
            $("#busList").html(html);
        }
    });
}

// =======================
// SELECT SEAT
// =======================
function selectSeat(seat) {
    localStorage.setItem("booking_seat", seat);

    $("#busList").html(`
        <div class="alert alert-success">
            You selected <b>Seat ${seat}</b>
        </div>
        <button id="payNow" class="btn btn-success">Proceed to Payment</button>
    `);
}

// =======================
// PROCEED TO PAYMENT
// =======================
$(document).on("click", "#payNow", function () {
    window.location.href = "user_payment.html";
});

// =======================
// PAYMENT PAGE – SHOW FARE & VALIDATE INPUT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("user_payment.html")) {
        const fare = localStorage.getItem("booking_fare");
        const payBtn = document.getElementById("payBtn");

        if (payBtn) {
            payBtn.innerText = `Pay ₹${fare}`;

            payBtn.addEventListener("click", function(e) {
                e.preventDefault(); // prevent reload

                const name = document.getElementById("cardName").value.trim();
                const number = document.getElementById("cardNumber").value.trim();

                if (!name || !number) {
                    alert("Please enter your name and card number.");
                    return;
                }

                if (!/^\d{12,19}$/.test(number)) {
                    alert("Please enter a valid card number (12-19 digits).");
                    return;
                }

                paymentDone();
            });
        }
    }
});

// =======================
// PAYMENT DONE – SAVE BOOKING
// =======================
function paymentDone() {
    const bus_id = localStorage.getItem("booking_busId");
    const route = localStorage.getItem("booking_route");
    const fare = localStorage.getItem("booking_fare");
    const seat = localStorage.getItem("booking_seat");

    $.ajax({
        url: "api/save_booking.php",
        type: "POST",
        data: {
            bus_id: bus_id,
            route: route,
            fare: fare,
            seat: seat
        },
        success: function() {
            alert("Booking Successful!");

            localStorage.removeItem("booking_busId");
            localStorage.removeItem("booking_route");
            localStorage.removeItem("booking_fare");
            localStorage.removeItem("booking_seat");

            window.location.href = "user_index.html";
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("Error processing booking. Please try again.");
        }
    });
}

// =======================
// BUS TRACKING
// =======================
function moveBus() {
    const bus = document.getElementById("bus");
    if (bus) {
        let currentLeft = parseInt(bus.style.left) || 20;
        let newLeft = currentLeft + Math.floor(Math.random() * 50);
        if (newLeft > 300) newLeft = 20;
        bus.style.left = newLeft + "px";
    }
}
