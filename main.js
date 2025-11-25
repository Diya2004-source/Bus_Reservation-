// Bus data
const buses = [
  { from: 'Mumbai', to: 'Ahmedabad', time: '09:00 AM', price: 500, class: 'AC' },
  { from: 'Mumbai', to: 'Ahmedabad', time: '01:00 PM', price: 450, class: 'Non-AC' },
  { from: 'Mumbai', to: 'Ahmedabad', time: '08:00 PM', price: 600, class: 'Sleeper' },
  { from: 'Mumbai', to: 'Surat', time: '06:00 AM', price: 400, class: 'AC' },
  { from: 'Ahmedabad', to: 'Mumbai', time: '08:00 AM', price: 500, class: 'AC' },
  { from: 'Ahmedabad', to: 'Surat', time: '11:00 AM', price: 450, class: 'Non-AC' },
];

// Function to display cards
function displayBuses(busList) {
  const cardsRow = document.getElementById('cardsRow');
  cardsRow.innerHTML = '';

  if (busList.length === 0) {
    cardsRow.innerHTML = `<div class="alert alert-warning text-center w-100">No buses available.</div>`;
    return;
  }

  busList.forEach((bus, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card bus-card mb-4 p-3">
        <div class="card-body text-center">
          <h5 class="card-title">${bus.from} → ${bus.to}</h5>
          <p class="card-text"><strong>Time:</strong> ${bus.time}</p>
          <p class="card-text"><strong>Class:</strong> ${bus.class}</p>
          <p class="card-text"><strong>Price:</strong> ₹${bus.price}</p>
          <button class="btn btn-success" onclick="bookBus(${index})">Book Now</button>
        </div>
      </div>
    `;
    cardsRow.appendChild(col);
  });
}

// Function to search buses
function searchBuses() {
  const fromInput = document.getElementById('from').value.trim().toLowerCase();
  const toInput = document.getElementById('to').value.trim().toLowerCase();
  const selectedClass = document.getElementById('busClass').value.toLowerCase();

  const filteredBuses = buses.filter(bus =>
    (fromInput === '' || bus.from.toLowerCase() === fromInput) &&
    (toInput === '' || bus.to.toLowerCase() === toInput) &&
    (selectedClass === '' || bus.class.toLowerCase() === selectedClass)
  );

  displayBuses(filteredBuses);
}

// Function to book bus and generate QR
function bookBus(index) {
  const bus = buses[index];
  const bookingDiv = document.getElementById('bookingInfo');
  bookingDiv.innerHTML = `
    <h4>Booking Confirmed!</h4>
    <p>${bus.from} → ${bus.to} at ${bus.time}</p>
    <p>Class: ${bus.class} | Price: ₹${bus.price}</p>
    <canvas id="qrCode"></canvas>
  `;

  const qr = new QRious({
    element: document.getElementById('qrCode'),
    value: `Bus Ticket: ${bus.from} → ${bus.to}, Time: ${bus.time}, Class: ${bus.class}, Price: ${bus.price}`,
    size: 150
  });
}

// Show all buses on page load
window.onload = () => displayBuses(buses);

// Search button click
document.getElementById('searchBtn').addEventListener('click', searchBuses);
