 // Comprehensive bus data with routes for EVERY combination
        // We have 8 locations, so 56 possible routes (8x7)
        
        const locations = {
            'railway-station': 'Rajkot Railway Station',
            'bus-stand': 'Rajkot Bus Stand',
            'airport': 'Rajkot Airport',
            'mavdi': 'Mavdi Circle',
            'kalawad': 'Kalawad Road',
            'university': 'RK University',
            'race-course': 'Race Course',
            'gondal': 'Gondal Road'
        };

        // Helper function to generate bus routes for all combinations
        function generateAllBusRoutes() {
            const allBuses = [];
            let busId = 1;
            
            const locationKeys = Object.keys(locations);
            
            // Generate buses for all possible combinations
            for (let i = 0; i < locationKeys.length; i++) {
                for (let j = 0; j < locationKeys.length; j++) {
                    if (i === j) continue; // Skip same from and to
                    
                    const fromKey = locationKeys[i];
                    const toKey = locationKeys[j];
                    const fromName = locations[fromKey];
                    const toName = locations[toKey];
                    
                    // Generate 2-3 buses per route (morning, afternoon, evening)
                    const busTypes = ['AC', 'Non-AC', 'AC Sleeper'];
                    const frequencies = ['Every 30 minutes', 'Every 45 minutes', 'Every 1 hour'];
                    const amenitiesList = [
                        ['WiFi', 'Charging Ports', 'AC', 'Water Bottle'],
                        ['Comfort Seats', 'Water Bottle'],
                        ['WiFi', 'AC', 'Entertainment'],
                        ['WiFi', 'AC', 'Blanket', 'Snacks']
                    ];
                    
                    // Create morning bus
                    allBuses.push(createBus(
                        busId++, 
                        fromKey, 
                        toKey, 
                        fromName, 
                        toName, 
                        'morning',
                        busTypes[busId % 3],
                        frequencies[busId % 3],
                        amenitiesList[busId % 4]
                    ));
                    
                    // Create afternoon bus
                    allBuses.push(createBus(
                        busId++, 
                        fromKey, 
                        toKey, 
                        fromName, 
                        toName, 
                        'afternoon',
                        busTypes[(busId + 1) % 3],
                        frequencies[(busId + 1) % 3],
                        amenitiesList[(busId + 1) % 4]
                    ));
                    
                    // Create evening bus for popular routes
                    if (isPopularRoute(fromKey, toKey)) {
                        allBuses.push(createBus(
                            busId++, 
                            fromKey, 
                            toKey, 
                            fromName, 
                            toName, 
                            'evening',
                            busTypes[(busId + 2) % 3],
                            frequencies[(busId + 2) % 3],
                            amenitiesList[(busId + 2) % 4]
                        ));
                    }
                }
            }
            
            return allBuses;
        }
        
        function isPopularRoute(fromKey, toKey) {
            const popularRoutes = [
                ['railway-station', 'airport'],
                ['bus-stand', 'university'],
                ['mavdi', 'race-course'],
                ['kalawad', 'gondal'],
                ['railway-station', 'bus-stand'],
                ['airport', 'university'],
                ['race-course', 'mavdi']
            ];
            
            return popularRoutes.some(route => 
                (route[0] === fromKey && route[1] === toKey) || 
                (route[0] === toKey && route[1] === fromKey)
            );
        }
        
        function createBus(id, fromKey, toKey, fromName, toName, timeOfDay, type, frequency, amenities) {
            // Determine departure time based on time of day
            let departureTime, departureMinutes;
            switch(timeOfDay) {
                case 'morning':
                    departureMinutes = 6 * 60 + (id % 12) * 30; // 6:00 AM to 12:00 PM
                    break;
                case 'afternoon':
                    departureMinutes = 12 * 60 + (id % 8) * 45; // 12:00 PM to 6:00 PM
                    break;
                case 'evening':
                    departureMinutes = 18 * 60 + (id % 6) * 30; // 6:00 PM to 10:00 PM
                    break;
            }
            
            const hours = Math.floor(departureMinutes / 60);
            const minutes = departureMinutes % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours > 12 ? hours - 12 : hours;
            departureTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            
            // Calculate arrival time (add 30-120 minutes)
            const travelMinutes = 30 + (id % 90); // 30 to 120 minutes
            const arrivalMinutes = departureMinutes + travelMinutes;
            const arrivalHours = Math.floor(arrivalMinutes / 60);
            const arrivalMins = arrivalMinutes % 60;
            const arrivalPeriod = arrivalHours >= 12 ? 'PM' : 'AM';
            const arrivalDisplayHours = arrivalHours > 12 ? arrivalHours - 12 : arrivalHours;
            const arrivalTime = `${arrivalDisplayHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')} ${arrivalPeriod}`;
            
            // Duration string
            const durationHours = Math.floor(travelMinutes / 60);
            const durationMinutes = travelMinutes % 60;
            const durationStr = durationHours > 0 ? 
                `${durationHours} hour${durationHours > 1 ? 's' : ''} ${durationMinutes} mins` : 
                `${durationMinutes} mins`;
            
            // Generate bus names based on route
            const busNames = [
                `${fromName.split(' ')[0]} Express`,
                `${fromName.split(' ')[0]} - ${toName.split(' ')[0]} Connect`,
                `City Shuttle ${fromName.split(' ')[0]}`,
                `Rajkot ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Service`,
                `GreenRide ${fromName.split(' ')[0]} Line`
            ];
            
            const busName = busNames[id % busNames.length];
            
            // Fare calculation based on distance and type
            let baseFare = 15 + (id % 35); // 15 to 50
            if (type.includes('AC')) baseFare += 5;
            if (type.includes('Sleeper')) baseFare += 10;
            
            // Total seats
            const totalSeats = [30, 35, 40, 45][id % 4];
            const availableSeats = Math.max(5, totalSeats - (id % 20));
            
            // Bus number
            const busNumber = `RJ01-${String.fromCharCode(65 + (id % 26))}${String.fromCharCode(65 + ((id + 1) % 26))}-${(1000 + id).toString().padStart(4, '0')}`;
            
            // First and last bus
            const firstBus = timeOfDay === 'morning' ? '06:00 AM' : 
                           timeOfDay === 'afternoon' ? '12:00 PM' : '06:00 PM';
            const lastBus = timeOfDay === 'morning' ? '12:00 PM' : 
                          timeOfDay === 'afternoon' ? '06:00 PM' : '10:00 PM';
            
            // Generate schedule for the day
            const schedule = generateSchedule(fromName, toName, timeOfDay, frequency);
            
            // Generate route stops
            const routeStops = generateRouteStops(fromName, toName, departureTime, travelMinutes);
            
            return {
                id: id,
                name: busName,
                from: fromKey,
                to: toKey,
                departure: departureTime,
                arrival: arrivalTime,
                duration: durationStr,
                fare: baseFare,
                type: type,
                totalSeats: totalSeats,
                availableSeats: availableSeats,
                amenities: amenities,
                route: `${fromName} to ${toName}`,
                stops: routeStops.length,
                busNumber: busNumber,
                frequency: frequency,
                firstBus: firstBus,
                lastBus: lastBus,
                schedule: schedule,
                routeStops: routeStops,
                timeOfDay: timeOfDay
            };
        }
        
        function generateSchedule(fromName, toName, timeOfDay, frequency) {
            const schedule = [];
            let startHour, endHour, interval;
            
            switch(timeOfDay) {
                case 'morning':
                    startHour = 6;
                    endHour = 12;
                    break;
                case 'afternoon':
                    startHour = 12;
                    endHour = 18;
                    break;
                case 'evening':
                    startHour = 18;
                    endHour = 22;
                    break;
            }
            
            switch(frequency) {
                case 'Every 30 minutes':
                    interval = 30;
                    break;
                case 'Every 45 minutes':
                    interval = 45;
                    break;
                case 'Every 1 hour':
                    interval = 60;
                    break;
            }
            
            let currentMinutes = startHour * 60;
            while (currentMinutes < endHour * 60) {
                const hours = Math.floor(currentMinutes / 60);
                const minutes = currentMinutes % 60;
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours > 12 ? hours - 12 : hours;
                const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
                
                schedule.push({
                    time: timeStr,
                    from: fromName,
                    to: toName
                });
                
                currentMinutes += interval;
            }
            
            return schedule.slice(0, 8); // Limit to 8 schedules
        }
        
        function generateRouteStops(fromName, toName, startTime, totalMinutes) {
            const commonStops = [
                'Kotecha Chowk',
                'Jalaram Temple',
                'Amin Marg',
                'Metoda GIDC',
                'Saurashtra University',
                'Airport Circle',
                'University Road',
                'Gondal Road',
                'Kalawad Road',
                'Race Course',
                'Nana Mava Road',
                'Bhakti Nagar',
                'Jivraj Park',
                'Panchnath Plot',
                'Madhapar Road',
                'Yagnik Road',
                'Jagnath Plot',
                'Gurukul Road'
            ];
            
            // Shuffle and select 4-8 stops
            const shuffledStops = [...commonStops].sort(() => Math.random() - 0.5);
            const numStops = 4 + Math.floor(Math.random() * 4);
            const selectedStops = shuffledStops.slice(0, numStops);
            
            // Add start and end stops
            const allStops = [
                { name: fromName, time: startTime }
            ];
            
            // Calculate time for each stop
            let currentMinutes = convertTimeToMinutes(startTime);
            const interval = Math.floor(totalMinutes / (selectedStops.length + 1));
            
            selectedStops.forEach((stop, index) => {
                currentMinutes += interval;
                const hours = Math.floor(currentMinutes / 60);
                const minutes = currentMinutes % 60;
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours > 12 ? hours - 12 : hours;
                const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
                
                allStops.push({
                    name: stop,
                    time: timeStr
                });
            });
            
            // Add final destination
            currentMinutes += interval;
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours > 12 ? hours - 12 : hours;
            const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            
            allStops.push({
                name: toName,
                time: timeStr
            });
            
            return allStops;
        }
        
        function convertTimeToMinutes(timeStr) {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            return hours * 60 + minutes;
        }
        
        // Generate all bus routes
        const busData = generateAllBusRoutes();
        
        console.log(`Generated ${busData.length} bus routes for all combinations`);

        // Sample bookings data
        const sampleBookings = [
            {
                id: 1001,
                busId: 1,
                userId: 1,
                date: new Date().toISOString().split('T')[0],
                seats: ["A1", "A2"],
                totalAmount: 50,
                status: "confirmed",
                bookingDate: new Date().toISOString(),
                passengerName: "John Doe",
                paymentMethod: "upi",
                busDetails: busData[0]
            },
            {
                id: 1002,
                busId: 3,
                userId: 1,
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                seats: ["B3"],
                totalAmount: 15,
                status: "upcoming",
                bookingDate: new Date().toISOString(),
                passengerName: "John Doe",
                paymentMethod: "card",
                busDetails: busData[2]
            }
        ];

        // Database simulation
        class Database {
            constructor() {
                this.users = JSON.parse(localStorage.getItem('greenRideUsers')) || [];
                this.bookings = JSON.parse(localStorage.getItem('greenRideBookings')) || sampleBookings;
                this.busSeats = JSON.parse(localStorage.getItem('greenRideBusSeats')) || {};
            }

            saveUsers() {
                localStorage.setItem('greenRideUsers', JSON.stringify(this.users));
            }

            saveBookings() {
                localStorage.setItem('greenRideBookings', JSON.stringify(this.bookings));
            }

            saveBusSeats() {
                localStorage.setItem('greenRideBusSeats', JSON.stringify(this.busSeats));
            }

            getUserByEmail(email) {
                return this.users.find(user => user.email === email);
            }

            addUser(user) {
                user.id = this.users.length + 1;
                user.bookings = [];
                user.createdAt = new Date().toISOString();
                this.users.push(user);
                this.saveUsers();
                return user;
            }

            addBooking(booking) {
                booking.id = Date.now();
                booking.bookingDate = new Date().toISOString();
                this.bookings.push(booking);
                this.saveBookings();
                
                // Update bus seats
                this.markSeatsAsBooked(booking.busId, booking.date, booking.seats);
                
                return booking;
            }

            getBookingsByUser(userId) {
                return this.bookings.filter(booking => booking.userId === userId);
            }

            cancelBooking(bookingId) {
                const booking = this.bookings.find(b => b.id === bookingId);
                if (booking) {
                    booking.status = 'cancelled';
                    this.saveBookings();
                    
                    // Free up seats
                    this.freeSeats(booking.busId, booking.date, booking.seats);
                    
                    return true;
                }
                return false;
            }

            markSeatsAsBooked(busId, date, seats) {
                const key = `${busId}-${date}`;
                if (!this.busSeats[key]) {
                    this.busSeats[key] = [];
                }
                this.busSeats[key].push(...seats);
                this.saveBusSeats();
            }

            freeSeats(busId, date, seats) {
                const key = `${busId}-${date}`;
                if (this.busSeats[key]) {
                    this.busSeats[key] = this.busSeats[key].filter(seat => !seats.includes(seat));
                    this.saveBusSeats();
                }
            }

            getBookedSeats(busId, date) {
                const key = `${busId}-${date}`;
                return this.busSeats[key] || [];
            }
        }

        const db = new Database();
        let currentUser = null;
        let currentBooking = null;
        let selectedSeats = [];
        let selectedPaymentMethod = null;
        let userBookings = [];
        let currentTimeFilter = 'all';

        $(document).ready(function() {
            // Initialize the application
            initApp();
            
            function initApp() {
                checkLoginState();
                setupEventListeners();
                setupRealTimeValidation();
                setDefaultDate();
                populateRouteCount();
            }
            
            function populateRouteCount() {
                const routeCount = busData.length;
                const uniqueRoutes = new Set();
                busData.forEach(bus => {
                    uniqueRoutes.add(`${bus.from}-${bus.to}`);
                });
                
                console.log(`Total buses: ${routeCount}, Unique routes: ${uniqueRoutes.size}`);
            }
            
            function setDefaultDate() {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const dateStr = tomorrow.toISOString().split('T')[0];
                $('#date').val(dateStr);
                $('#date').attr('min', new Date().toISOString().split('T')[0]);
            }
            
            function setupEventListeners() {
                // Auth buttons
                $('#loginBtn').on('click', showLoginModal);
                $('#registerBtn').on('click', showRegisterModal);
                
                // Modal close buttons
                $('#closeModal').on('click', closeAuthModal);
                $('#closeForgotModal').on('click', closeForgotModal);
                $('#closeSeatModal').on('click', closeSeatModal);
                $('#closePaymentModal').on('click', closePaymentModal);
                $('#closeProfileModal').on('click', closeProfileModal);
                
                // Navigation
                $('.nav-link').on('click', handleNavigation);
                $('#modifySearch').on('click', () => showSection('search'));
                
                // Dashboard actions
                $('#quickSearch').on('click', () => showSection('search'));
                $('#viewBookings').on('click', () => showSection('bookings'));
                $('#editProfile').on('click', showProfileModal);
                
                // Auth modal tabs
                $('#loginTab').on('click', showLoginTab);
                $('#registerTab').on('click', showRegisterTab);
                $('#switchToRegister').on('click', showRegisterTab);
                $('#switchToLogin').on('click', showLoginTab);
                
                // Forgot password
                $('#forgotPasswordLink').on('click', showForgotPasswordModal);
                $('#backToLogin').on('click', backToLoginFromForgot);
                
                // Form submissions
                $('#loginForm').on('submit', handleLogin);
                $('#registerForm').on('submit', handleRegister);
                $('#searchForm').on('submit', handleSearch);
                $('#profileForm').on('submit', handleProfileUpdate);
                $('#forgotPasswordFormElement').on('submit', handleForgotPassword);
                
                // Seat selection
                $(document).on('click', '.seat:not(.booked)', handleSeatSelection);
                $('#proceedToPayment').on('click', showPaymentModal);
                
                // Payment
                $('.payment-option').on('click', selectPaymentMethod);
                $('#confirmPayment').on('click', processPayment);
                
                // Bookings
                $(document).on('click', '.cancel-booking', cancelBooking);
                $('.tab[data-filter]').on('click', filterBookings);
                
                // Popular routes
                $('.popular-route').on('click', handlePopularRouteClick);
                
                // Schedule view toggle
                $(document).on('click', '.view-schedule-btn', toggleScheduleView);
                
                // Time filter buttons
                $('.time-filter-btn').on('click', handleTimeFilter);
            }
            
            function showNotification(message, type = 'info') {
                const notification = $('#notification');
                const text = $('#notificationText');
                
                notification.removeClass('success error info').addClass(type);
                text.text(message);
                notification.addClass('show');
                
                setTimeout(() => {
                    notification.removeClass('show');
                }, 3000);
            }
            
            function showSection(section) {
                // Hide all main sections
                $('.hero, .search-section, .features, .bus-list, .dashboard-section').hide();
                
                // Remove active class from all nav links
                $('.nav-link').removeClass('active');
                
                // Show selected section
                switch(section) {
                    case 'home':
                        $('#homeSection').show();
                        $('#featuresSection').show();
                        $('.nav-link[data-section="home"]').addClass('active');
                        break;
                    case 'search':
                        $('#searchSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        // Scroll to search section
                        $('html, body').animate({
                            scrollTop: $('#searchSection').offset().top - 100
                        }, 500);
                        break;
                    case 'dashboard':
                        if (!currentUser) {
                            showLoginModal();
                            showNotification('Please login to access dashboard', 'info');
                            return;
                        }
                        $('#dashboardSection').show();
                        loadDashboard();
                        $('.nav-link[data-section="dashboard"]').addClass('active');
                        break;
                    case 'bookings':
                        if (!currentUser) {
                            showLoginModal();
                            showNotification('Please login to view bookings', 'info');
                            return;
                        }
                        $('#bookingsSection').show();
                        loadUserBookings('all');
                        $('.nav-link[data-section="bookings"]').addClass('active');
                        break;
                    case 'busList':
                        $('#busListSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        break;
                }
            }
            
            function handleNavigation(e) {
                e.preventDefault();
                const section = $(this).data('section');
                showSection(section);
            }
            
            function checkLoginState() {
                const userData = localStorage.getItem('currentUser');
                if (userData) {
                    currentUser = JSON.parse(userData);
                    updateAuthUI();
                    userBookings = db.getBookingsByUser(currentUser.id);
                }
            }
            
            function updateAuthUI() {
                if (currentUser) {
                    $('#authButtons').html(`
                        <div class="user-welcome">
                            <i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}
                        </div>
                        <button class="logout-btn" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    `);
                    
                    // Show dashboard and bookings links
                    $('#dashboardLink, #bookingsLink').show();
                    
                    // Attach logout handler
                    $('#logoutBtn').on('click', handleLogout);
                } else {
                    $('#authButtons').html(`
                        <button class="login-btn" id="loginBtn"><i class="fas fa-sign-in-alt"></i> Login</button>
                        <button class="register-btn" id="registerBtn"><i class="fas fa-user-plus"></i> Register</button>
                    `);
                    
                    // Hide dashboard and bookings links
                    $('#dashboardLink, #bookingsLink').hide();
                    
                    // Reattach event listeners
                    $('#loginBtn').on('click', showLoginModal);
                    $('#registerBtn').on('click', showRegisterModal);
                }
            }
            
            function showLoginModal() {
                $('#authModal').css('display', 'flex');
                showLoginTab();
            }
            
            function showRegisterModal() {
                $('#authModal').css('display', 'flex');
                showRegisterTab();
            }
            
            function showLoginTab() {
                $('#loginTab').addClass('active');
                $('#registerTab').removeClass('active');
                $('#loginContent').addClass('active');
                $('#registerContent').removeClass('active');
                $('#modalTitle').text('Login to Your Account');
                clearFormErrors();
            }
            
            function showRegisterTab() {
                $('#registerTab').addClass('active');
                $('#loginTab').removeClass('active');
                $('#registerContent').addClass('active');
                $('#loginContent').removeClass('active');
                $('#modalTitle').text('Create an Account');
                clearFormErrors();
            }
            
            function showForgotPasswordModal(e) {
                e.preventDefault();
                $('#authModal').css('display', 'none');
                $('#forgotPasswordModal').css('display', 'flex');
                clearFormErrors();
            }
            
            function backToLoginFromForgot(e) {
                e.preventDefault();
                $('#forgotPasswordModal').css('display', 'none');
                showLoginModal();
            }
            
            function closeAuthModal() {
                $('#authModal').css('display', 'none');
            }
            
            function closeForgotModal() {
                $('#forgotPasswordModal').css('display', 'none');
            }
            
            function closeSeatModal() {
                $('#seatSelectionModal').css('display', 'none');
                selectedSeats = [];
            }
            
            function closePaymentModal() {
                $('#paymentModal').css('display', 'none');
                selectedPaymentMethod = null;
            }
            
            function closeProfileModal() {
                $('#profileModal').css('display', 'none');
            }
            
            function handleLogin(e) {
                e.preventDefault();
                
                const email = $('#loginEmail').val();
                const password = $('#loginPassword').val();
                
                if (!validateEmail(email)) {
                    showNotification('Please enter a valid email', 'error');
                    return;
                }
                
                if (!validatePassword(password)) {
                    showNotification('Password must be at least 6 characters', 'error');
                    return;
                }
                
                const user = db.getUserByEmail(email);
                
                if (!user || user.password !== password) {
                    showNotification('Invalid email or password', 'error');
                    return;
                }
                
                // Login successful
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                userBookings = db.getBookingsByUser(currentUser.id);
                updateAuthUI();
                closeAuthModal();
                showNotification('Login successful! Welcome back, ' + user.name, 'success');
                showSection('dashboard');
            }
            
            function handleRegister(e) {
                e.preventDefault();
                
                const name = $('#regName').val();
                const email = $('#regEmail').val();
                const phone = $('#regPhone').val();
                const password = $('#regPassword').val();
                const confirmPassword = $('#regConfirmPassword').val();
                
                // Validate inputs
                if (!validateName(name)) {
                    showNotification('Please enter your full name', 'error');
                    return;
                }
                
                if (!validateEmail(email)) {
                    showNotification('Please enter a valid email', 'error');
                    return;
                }
                
                if (!validatePhone(phone)) {
                    showNotification('Please enter a valid 10-digit phone number', 'error');
                    return;
                }
                
                if (!validatePassword(password)) {
                    showNotification('Password must be at least 6 characters', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('Passwords do not match', 'error');
                    return;
                }
                
                // Check if user already exists
                if (db.getUserByEmail(email)) {
                    showNotification('User with this email already exists', 'error');
                    return;
                }
                
                // Create new user
                const user = {
                    name: name,
                    email: email,
                    phone: phone,
                    password: password
                };
                
                const newUser = db.addUser(user);
                currentUser = newUser;
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                userBookings = [];
                updateAuthUI();
                closeAuthModal();
                showNotification('Registration successful! Welcome to GreenRide', 'success');
                showSection('dashboard');
            }
            
            function handleSearch(e) {
                e.preventDefault();
                
                const from = $('#from').val();
                const to = $('#to').val();
                const date = $('#date').val();
                
                // Validate inputs
                if (!from || !to || !date) {
                    showNotification('Please fill all search fields', 'error');
                    return;
                }
                
                if (from === to) {
                    showNotification('Departure and destination cannot be the same', 'error');
                    return;
                }
                
                if (!validateDate(date)) {
                    showNotification('Please select a valid date', 'error');
                    return;
                }
                
                // Show loading
                $('#busResults').html(`
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                `);
                
                // Simulate API call delay
                setTimeout(() => {
                    // Perform search
                    const filteredBuses = busData.filter(bus => 
                        bus.from === from && bus.to === to
                    );
                    
                    // Display results
                    displaySearchResults(filteredBuses, from, to, date);
                }, 1000);
            }
            
            function displaySearchResults(buses, from, to, date) {
                const fromName = $('#from option:selected').text();
                const toName = $('#to option:selected').text();
                
                $('#resultsCount').text(`${buses.length} bus${buses.length !== 1 ? 'es' : ''} found for ${fromName} to ${toName} on ${formatDate(date)}`);
                
                $('#busResults').empty();
                
                if (buses.length === 0) {
                    $('#busResults').html(`
                        <div class="no-results">
                            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px;"></i>
                            <h3>No buses found for your search</h3>
                            <p>Try changing your departure or destination points</p>
                            <p>Or try searching for these popular routes:</p>
                            <div style="margin-top: 20px;">
                                <button class="action-btn" data-from="railway-station" data-to="airport" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Railway Station to Airport
                                </button>
                                <button class="action-btn" data-from="bus-stand" data-to="university" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Bus Stand to University
                                </button>
                                <button class="action-btn" data-from="mavdi" data-to="race-course" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Mavdi to Race Course
                                </button>
                            </div>
                        </div>
                    `);
                    
                    // Attach click handlers to popular route buttons
                    $('.action-btn[data-from]').on('click', function() {
                        const from = $(this).data('from');
                        const to = $(this).data('to');
                        $('#from').val(from);
                        $('#to').val(to);
                        $('#searchForm').submit();
                    });
                } else {
                    // Sort buses by departure time
                    buses.sort((a, b) => {
                        return convertTimeToMinutes(a.departure) - convertTimeToMinutes(b.departure);
                    });
                    
                    // Apply time filter
                    const filteredBuses = applyTimeFilter(buses, currentTimeFilter);
                    
                    filteredBuses.forEach(bus => {
                        const bookedSeats = db.getBookedSeats(bus.id, date);
                        const availableSeats = bus.totalSeats - bookedSeats.length;
                        
                        const busCard = `
                            <div class="bus-card" data-bus-id="${bus.id}">
                                <div class="bus-info">
                                    <h3 class="bus-name">
                                        ${bus.name}
                                        <span style="font-size: 14px; color: var(--text-light); margin-left: 10px;">
                                            ${bus.timeOfDay === 'morning' ? '🌅 Morning' : bus.timeOfDay === 'afternoon' ? '☀️ Afternoon' : '🌇 Evening'} Service
                                        </span>
                                    </h3>
                                    <div class="schedule-info">
                                        <div class="timing-row">
                                            <div>
                                                <span class="timing-label">Departure:</span>
                                                <span class="timing-value"> ${bus.departure}</span>
                                            </div>
                                            <div>
                                                <span class="timing-label">Arrival:</span>
                                                <span class="timing-value"> ${bus.arrival}</span>
                                            </div>
                                        </div>
                                        <div class="duration">Journey Time: ${bus.duration}</div>
                                        <div class="timing-row">
                                            <div>
                                                <span class="timing-label">Frequency:</span>
                                                <span class="timing-value"> ${bus.frequency}</span>
                                            </div>
                                            <div>
                                                <span class="timing-label">First Bus:</span>
                                                <span class="timing-value"> ${bus.firstBus}</span>
                                            </div>
                                            <div>
                                                <span class="timing-label">Last Bus:</span>
                                                <span class="timing-value"> ${bus.lastBus}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bus-details">
                                        <span><i class="fas ${bus.type.includes('AC') ? 'fa-snowflake' : 'fa-bus'}"></i> ${bus.type}</span>
                                        <span><i class="fas fa-users"></i> Seats Available: ${availableSeats}</span>
                                        <span><i class="fas fa-map-marker-alt"></i> Stops: ${bus.stops}</span>
                                        <span><i class="fas fa-bus"></i> Bus No: ${bus.busNumber}</span>
                                    </div>
                                    <div class="bus-details">
                                        ${bus.amenities.map(amenity => `<span><i class="fas fa-check"></i> ${amenity}</span>`).join('')}
                                    </div>
                                    <button class="action-btn view-schedule-btn" style="margin-top: 10px;">
                                        <i class="fas fa-clock"></i> View Full Schedule & Route
                                    </button>
                                    <div class="route-map" style="display: none; margin-top: 15px;" id="routeMap-${bus.id}">
                                        <h4>Route Stops with Timings:</h4>
                                        ${bus.routeStops.map(stop => `
                                            <div class="route-stop">
                                                <div class="stop-dot"></div>
                                                <div class="stop-name">${stop.name}</div>
                                                <div class="stop-time">${stop.time}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="schedule-info" style="display: none; margin-top: 15px;" id="schedule-${bus.id}">
                                        <h4>Today's Schedule:</h4>
                                        ${bus.schedule.map(slot => `
                                            <div style="padding: 8px; border-bottom: 1px solid #eee;">
                                                <strong>${slot.time}</strong> - ${slot.from} to ${slot.to}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="bus-fare">
                                    <div class="fare-amount">₹${bus.fare}</div>
                                    <button class="book-btn" data-bus-id="${bus.id}" data-date="${date}">
                                        ${availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                                    </button>
                                    <div style="margin-top: 10px; font-size: 12px; color: var(--text-light);">
                                        <i class="fas fa-info-circle"></i> Fare per seat
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#busResults').append(busCard);
                    });
                    
                    // Attach booking handlers
                    $('.book-btn:not(:contains("Sold Out"))').on('click', function() {
                        const busId = $(this).data('bus-id');
                        const date = $(this).data('date');
                        startBookingProcess(busId, date);
                    });
                }
                
                // Show results section
                $('#busListSection').show();
                showSection('busList');
                
                // Scroll to results
                $('html, body').animate({
                    scrollTop: $('#busListSection').offset().top - 100
                }, 500);
            }
            
            function applyTimeFilter(buses, timeFilter) {
                if (timeFilter === 'all') return buses;
                
                return buses.filter(bus => {
                    const departureMinutes = convertTimeToMinutes(bus.departure);
                    
                    switch(timeFilter) {
                        case 'morning':
                            return departureMinutes >= 5 * 60 && departureMinutes < 12 * 60;
                        case 'afternoon':
                            return departureMinutes >= 12 * 60 && departureMinutes < 17 * 60;
                        case 'evening':
                            return departureMinutes >= 17 * 60 && departureMinutes < 22 * 60;
                        default:
                            return true;
                    }
                });
            }
            
            function handleTimeFilter() {
                currentTimeFilter = $(this).data('time');
                $('.time-filter-btn').removeClass('active');
                $(this).addClass('active');
                
                // Get current search parameters and re-display results
                const from = $('#from').val();
                const to = $('#to').val();
                const date = $('#date').val();
                
                if (from && to && date) {
                    const filteredBuses = busData.filter(bus => 
                        bus.from === from && bus.to === to
                    );
                    displaySearchResults(filteredBuses, from, to, date);
                }
            }
            
            function toggleScheduleView() {
                const busCard = $(this).closest('.bus-card');
                const busId = busCard.data('bus-id');
                const routeMap = $(`#routeMap-${busId}`);
                const schedule = $(`#schedule-${busId}`);
                
                if (routeMap.is(':visible')) {
                    routeMap.slideUp();
                    schedule.slideUp();
                    $(this).html('<i class="fas fa-clock"></i> View Full Schedule & Route');
                } else {
                    routeMap.slideDown();
                    schedule.slideDown();
                    $(this).html('<i class="fas fa-times"></i> Hide Schedule & Route');
                }
            }
            
            function startBookingProcess(busId, date) {
                if (!currentUser) {
                    showLoginModal();
                    showNotification('Please login to book tickets', 'info');
                    return;
                }
                
                const bus = busData.find(b => b.id === busId);
                if (!bus) return;
                
                currentBooking = {
                    bus: bus,
                    date: date,
                    userId: currentUser.id
                };
                
                showSeatSelection(bus, date);
            }
            
            function showSeatSelection(bus, date) {
                $('#selectedBusName').text(bus.name);
                $('#selectedBusRoute').text($('#from option:selected').text() + ' to ' + $('#to option:selected').text());
                $('#selectedBusTime').text(bus.departure);
                $('#selectedBusFare').text(bus.fare);
                
                const bookedSeats = db.getBookedSeats(bus.id, date);
                
                // Generate seat layout
                const seatLayout = $('#seatLayout');
                seatLayout.empty();
                
                const rows = Math.ceil(bus.totalSeats / 4);
                let seatNumber = 1;
                
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (seatNumber > bus.totalSeats) break;
                        
                        const seatLetter = String.fromCharCode(65 + i);
                        const seatId = seatLetter + (j + 1);
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        
                        const seatClass = isBooked ? 'booked' : (isSelected ? 'selected' : '');
                        
                        seatLayout.append(`
                            <div class="seat ${seatClass}" data-seat="${seatId}">
                                ${seatId}
                            </div>
                        `);
                        seatNumber++;
                    }
                }
                
                updateSeatSelection();
                $('#seatSelectionModal').css('display', 'flex');
            }
            
            function handleSeatSelection() {
                const seat = $(this).data('seat');
                
                if (selectedSeats.includes(seat)) {
                    selectedSeats = selectedSeats.filter(s => s !== seat);
                } else {
                    if (selectedSeats.length < 5) {
                        selectedSeats.push(seat);
                    } else {
                        showNotification('Maximum 5 seats per booking', 'error');
                        return;
                    }
                }
                
                $(this).toggleClass('selected');
                updateSeatSelection();
            }
            
            function updateSeatSelection() {
                $('#selectedSeatsCount').text(selectedSeats.length);
                const totalAmount = selectedSeats.length * currentBooking.bus.fare;
                $('#totalAmount').text(totalAmount);
                
                // Enable/disable proceed button
                $('#proceedToPayment').prop('disabled', selectedSeats.length === 0);
            }
            
            function showPaymentModal() {
                if (selectedSeats.length === 0) {
                    showNotification('Please select at least one seat', 'error');
                    return;
                }
                
                const totalAmount = selectedSeats.length * currentBooking.bus.fare;
                
                $('#paymentSummary').html(`
                    <div style="margin-bottom: 20px; padding: 15px; background-color: var(--light-mint); border-radius: 8px;">
                        <h3>Booking Summary</h3>
                        <p><strong>Bus:</strong> ${currentBooking.bus.name}</p>
                        <p><strong>Route:</strong> ${$('#from option:selected').text()} to ${$('#to option:selected').text()}</p>
                        <p><strong>Date:</strong> ${formatDate(currentBooking.date)}</p>
                        <p><strong>Time:</strong> ${currentBooking.bus.departure}</p>
                        <p><strong>Duration:</strong> ${currentBooking.bus.duration}</p>
                        <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
                        <p><strong>Fare per seat:</strong> ₹${currentBooking.bus.fare}</p>
                        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    </div>
                `);
                
                $('#seatSelectionModal').css('display', 'none');
                $('#paymentModal').css('display', 'flex');
            }
            
            function selectPaymentMethod() {
                $('.payment-option').removeClass('selected');
                $(this).addClass('selected');
                selectedPaymentMethod = $(this).data('method');
                $('#confirmPayment').prop('disabled', false);
            }
            
            function processPayment() {
                if (!selectedPaymentMethod) {
                    showNotification('Please select a payment method', 'error');
                    return;
                }
                
                // Simulate payment processing
                showNotification('Processing payment...', 'info');
                
                setTimeout(() => {
                    // Create booking
                    const booking = {
                        busId: currentBooking.bus.id,
                        userId: currentUser.id,
                        date: currentBooking.date,
                        seats: selectedSeats,
                        totalAmount: selectedSeats.length * currentBooking.bus.fare,
                        status: 'confirmed',
                        passengerName: currentUser.name,
                        paymentMethod: selectedPaymentMethod,
                        busDetails: currentBooking.bus
                    };
                    
                    const newBooking = db.addBooking(booking);
                    userBookings.push(newBooking);
                    
                    // Close modals
                    $('#paymentModal').css('display', 'none');
                    selectedSeats = [];
                    selectedPaymentMethod = null;
                    
                    // Show success message
                    showNotification(`Booking confirmed! Ticket ID: ${newBooking.id}`, 'success');
                    
                    // Update dashboard
                    loadDashboard();
                    showSection('dashboard');
                }, 1500);
            }
            
            function loadDashboard() {
                if (!currentUser) return;
                
                $('#userName').text(currentUser.name);
                
                const totalBookings = userBookings.length;
                const upcomingTrips = userBookings.filter(b => 
                    b.status === 'confirmed' || b.status === 'upcoming'
                ).length;
                const totalSpent = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
                
                $('#totalBookings').text(totalBookings);
                $('#upcomingTrips').text(upcomingTrips);
                $('#totalSpent').text(totalSpent);
                
                // Load recent bookings
                loadRecentBookings();
            }
            
            function loadRecentBookings() {
                const recentBookings = userBookings.slice(0, 3);
                const container = $('#recentBookings');
                container.empty();
                
                if (recentBookings.length === 0) {
                    container.html('<p style="color: var(--text-light); text-align: center; padding: 20px;">No bookings yet. Start by searching for buses!</p>');
                    return;
                }
                
                recentBookings.forEach(booking => {
                    const bus = booking.busDetails;
                    const bookingCard = `
                        <div class="booking-card">
                            <div>
                                <h4>${bus?.name || 'Bus'}</h4>
                                <p>${formatDate(booking.date)} | ${bus?.departure || ''}</p>
                                <p>Seats: ${booking.seats.join(', ')}</p>
                            </div>
                            <div>
                                <span class="booking-status status-${booking.status}">
                                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <p style="text-align: right; margin-top: 5px;">₹${booking.totalAmount}</p>
                            </div>
                        </div>
                    `;
                    container.append(bookingCard);
                });
            }
            
            function loadUserBookings(filter = 'all') {
                const container = $('#userBookings');
                container.empty();
                
                let filteredBookings = userBookings;
                
                if (filter !== 'all') {
                    filteredBookings = userBookings.filter(booking => {
                        return booking.status === filter;
                    });
                }
                
                if (filteredBookings.length === 0) {
                    container.html(`
                        <div class="no-results">
                            <i class="fas fa-ticket-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
                            <h3>No ${filter} bookings found</h3>
                            <p>${filter === 'all' ? 'Start by booking your first bus ticket!' : 'Try changing the filter'}</p>
                        </div>
                    `);
                    return;
                }
                
                filteredBookings.forEach(booking => {
                    const bus = booking.busDetails;
                    const bookingCard = `
                        <div class="booking-card">
                            <div style="flex: 1;">
                                <h4>${bus?.name || 'Bus'}</h4>
                                <p><strong>Ticket ID:</strong> ${booking.id}</p>
                                <p><strong>Date:</strong> ${formatDate(booking.date)} | ${bus?.departure || ''}</p>
                                <p><strong>Route:</strong> ${bus?.route || 'N/A'}</p>
                                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                                <p><strong>Booked on:</strong> ${formatDate(booking.bookingDate)}</p>
                            </div>
                            <div style="text-align: right;">
                                <span class="booking-status status-${booking.status}">
                                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <h3 style="margin: 10px 0;">₹${booking.totalAmount}</h3>
                                ${(booking.status === 'confirmed' || booking.status === 'upcoming') ? 
                                    `<button class="cancel-btn cancel-booking" data-id="${booking.id}">
                                        Cancel Booking
                                    </button>` : ''
                                }
                            </div>
                        </div>
                    `;
                    container.append(bookingCard);
                });
            }
            
            function filterBookings() {
                const filter = $(this).data('filter');
                $('.tab[data-filter]').removeClass('active');
                $(this).addClass('active');
                loadUserBookings(filter);
            }
            
            function cancelBooking() {
                const bookingId = $(this).data('id');
                
                if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                    const success = db.cancelBooking(bookingId);
                    
                    if (success) {
                        // Update local bookings
                        const index = userBookings.findIndex(b => b.id === bookingId);
                        if (index !== -1) {
                            userBookings[index].status = 'cancelled';
                        }
                        
                        showNotification('Booking cancelled successfully', 'success');
                        loadUserBookings();
                        loadDashboard();
                    } else {
                        showNotification('Failed to cancel booking', 'error');
                    }
                }
            }
            
            function showProfileModal() {
                if (!currentUser) return;
                
                $('#profileName').val(currentUser.name);
                $('#profileEmail').val(currentUser.email);
                $('#profilePhone').val(currentUser.phone);
                $('#profilePassword').val('');
                $('#profileConfirmPassword').val('');
                
                $('#profileModal').css('display', 'flex');
            }
            
            function handleProfileUpdate(e) {
                e.preventDefault();
                
                const name = $('#profileName').val();
                const phone = $('#profilePhone').val();
                const password = $('#profilePassword').val();
                const confirmPassword = $('#profileConfirmPassword').val();
                
                if (!validateName(name)) {
                    showNotification('Please enter a valid name', 'error');
                    return;
                }
                
                if (!validatePhone(phone)) {
                    showNotification('Please enter a valid phone number', 'error');
                    return;
                }
                
                if (password && !validatePassword(password)) {
                    showNotification('Password must be at least 6 characters', 'error');
                    return;
                }
                
                if (password && password !== confirmPassword) {
                    showNotification('Passwords do not match', 'error');
                    return;
                }
                
                // Update user
                currentUser.name = name;
                currentUser.phone = phone;
                if (password) {
                    currentUser.password = password;
                }
                
                // Update in database
                const userIndex = db.users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    db.users[userIndex] = currentUser;
                    db.saveUsers();
                }
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateAuthUI();
                
                closeProfileModal();
                showNotification('Profile updated successfully', 'success');
                loadDashboard();
            }
            
            function handleForgotPassword(e) {
                e.preventDefault();
                
                const email = $('#forgotEmail').val();
                
                if (!validateEmail(email)) {
                    showNotification('Please enter a valid email', 'error');
                    return;
                }
                
                // Check if user exists
                const user = db.getUserByEmail(email);
                if (!user) {
                    showNotification('No account found with this email', 'error');
                    return;
                }
                
                // Simulate sending reset email
                $('#forgotSuccessMessage').show();
                
                setTimeout(() => {
                    $('#forgotSuccessMessage').hide();
                    $('#forgotEmail').val('');
                    closeForgotModal();
                    showLoginModal();
                }, 3000);
            }
            
            function handleLogout() {
                currentUser = null;
                localStorage.removeItem('currentUser');
                updateAuthUI();
                showNotification('Logged out successfully', 'info');
                showSection('home');
                userBookings = [];
            }
            
            function handlePopularRouteClick(e) {
                e.preventDefault();
                const from = $(this).data('from');
                const to = $(this).data('to');
                
                $('#from').val(from);
                $('#to').val(to);
                
                showSection('search');
                showNotification('Route selected. Please choose a date and search.', 'info');
            }
            
            // Helper functions
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            function validatePassword(password) {
                return password.length >= 6;
            }
            
            function validatePhone(phone) {
                const re = /^\d{10}$/;
                return re.test(phone.replace(/\D/g, ''));
            }
            
            function validateName(name) {
                return name.trim().length >= 2;
            }
            
            function validateDate(date) {
                const selectedDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today;
            }
            
            function clearFormErrors() {
                $('.validation-message').hide();
                $('.form-input').removeClass('error-border success-border');
            }
            
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            
            function convertTimeToMinutes(timeStr) {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                
                return hours * 60 + minutes;
            }
            
            function setupRealTimeValidation() {
                // Email validation
                $('#loginEmail, #regEmail, #forgotEmail').on('input', function() {
                    const email = $(this).val();
                    if (email === '') {
                        $(this).removeClass('error-border success-border');
                    } else if (validateEmail(email)) {
                        $(this).removeClass('error-border').addClass('success-border');
                    } else {
                        $(this).removeClass('success-border').addClass('error-border');
                    }
                });
                
                // Password validation
                $('#loginPassword, #regPassword, #profilePassword').on('input', function() {
                    const password = $(this).val();
                    if (password === '') {
                        $(this).removeClass('error-border success-border');
                    } else if (validatePassword(password)) {
                        $(this).removeClass('error-border').addClass('success-border');
                    } else {
                        $(this).removeClass('success-border').addClass('error-border');
                    }
                });
                
                // Phone validation
                $('#regPhone, #profilePhone').on('input', function() {
                    const phone = $(this).val();
                    if (phone === '') {
                        $(this).removeClass('error-border success-border');
                    } else if (validatePhone(phone)) {
                        $(this).removeClass('error-border').addClass('success-border');
                    } else {
                        $(this).removeClass('success-border').addClass('error-border');
                    }
                });
                
                // Name validation
                $('#regName, #profileName').on('input', function() {
                    const name = $(this).val();
                    if (name === '') {
                        $(this).removeClass('error-border success-border');
                    } else if (validateName(name)) {
                        $(this).removeClass('error-border').addClass('success-border');
                    } else {
                        $(this).removeClass('success-border').addClass('error-border');
                    }
                });
                
                // Confirm password validation
                $('#regConfirmPassword, #profileConfirmPassword').on('input', function() {
                    const confirmPassword = $(this).val();
                    const passwordField = $(this).attr('id').includes('reg') ? $('#regPassword') : $('#profilePassword');
                    const password = passwordField.val();
                    
                    if (confirmPassword === '') {
                        $(this).removeClass('error-border success-border');
                    } else if (password === confirmPassword) {
                        $(this).removeClass('error-border').addClass('success-border');
                    } else {
                        $(this).removeClass('success-border').addClass('error-border');
                    }
                });
            }
        });
