// =======================
// SEARCH BUS
// =======================
function searchBus() {
    const from = $("#from").val().trim();
    const to = $("#to").val().trim();

    if (!from || !to) {
        alert("Please enter both From and To cities.");
        return;
    }

    $.ajax({
        url: "api/search_bus.php",
        type: "GET",
        data: { from, to },
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
            $("#seatArea").html("");  // Clear previous seat layout
        },
        error: function () {
            alert("Error fetching buses. Try again.");
        }
    });
}

// =======================
// OPEN SEATS
// =======================
// =======================
// OPEN SEATS WITH BOOKED SEATS CHECK
// =======================
$(document).on("click", ".book-btn", function () {
    const busId = $(this).data("id");
    const route = $(this).data("route");
    const fare = $(this).data("fare");

    localStorage.setItem("booking_busId", busId);
    localStorage.setItem("booking_route", route);
    localStorage.setItem("booking_fare", fare);

    // Fetch booked seats for this bus
    $.ajax({
        url: "api/get_seats.php",
        type: "GET",
        data: { bus_id: busId },
        success: function(res) {
            const bookedSeats = JSON.parse(res).map(s => s.seat); // array of booked seat numbers

            let html = "<h3 class='text-center mt-3'>Select Your Seat</h3><div class='mt-3 text-center'>";

            for (let i = 1; i <= 30; i++) { // 30 seats per bus
                const disabled = bookedSeats.includes(i.toString()) ? "disabled" : "";
                const btnClass = bookedSeats.includes(i.toString()) ? "btn-secondary" : "btn-outline-success";

                html += `<button class="seat-btn btn ${btnClass} m-2" data-seat="${i}" ${disabled}>Seat ${i}</button>`;
            }

            html += "</div><div id='selectedSeat' class='mt-3 text-center'></div>";

            $("#seatArea").html(html);
            $("#busList").html(""); // clear bus list for clean UI
        },
        error: function() {
            alert("Error fetching seats. Please try again.");
        }
    });
});


// =======================
// SELECT SEAT
// =======================
$(document).on("click", ".seat-btn", function () {
    $(".seat-btn").removeClass("btn-success").addClass("btn-outline-success");
    $(this).removeClass("btn-outline-success").addClass("btn-success");

    const seat = $(this).data("seat");
    localStorage.setItem("booking_seat", seat);

    $("#selectedSeat").html(`
        <div class="alert alert-success">
            You selected <b>Seat ${seat}</b>
        </div>
        <button id="payNow" class="btn btn-success mt-2">Proceed to Payment</button>
    `);
});

// =======================
// PROCEED TO PAYMENT
// =======================
$(document).on("click", "#payNow", function () {
    window.location.href = "user_payment.html";
});

// =======================
// PAYMENT PAGE LOGIC
// =======================
$(document).ready(function () {
    if (window.location.pathname.includes("user_payment.html")) {
        const fare = localStorage.getItem("booking_fare");
        const payBtn = $("#payBtn");

        if (payBtn.length) {
            payBtn.text(`Pay ₹${fare}`);

            payBtn.on("click", function () {
                const name = $("#cardName").val().trim();
                const number = $("#cardNumber").val().trim();

                if (!name || !number) {
                    alert("Please enter card name & number!");
                    return;
                }

                if (!/^\d{12,19}$/.test(number)) {
                    alert("Invalid card number (12-19 digits)");
                    return;
                }

                paymentDone();
            });
        }
    }
});

// =======================
// SAVE BOOKING
// =======================
function paymentDone() {
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
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error processing booking.");
        }
    });
}
