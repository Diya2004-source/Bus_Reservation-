 // Bus data configuration
        const busTypes = ['AC', 'Non-AC', 'AC Sleeper'];
        const frequencies = ['Every 1 hour'];
        
        const locations = {
            'rajkot': 'Rajkot',
            'surat': 'Surat',
            'mumbai': 'Mumbai',
            'morbi': 'Morbi',
            'jamnagar': 'Jamnagar',
            'ahmedabad': 'Ahmedabad',
            'bangalore': 'Bangalore',
            'kolkata': 'Kolkata'
        };

        // Generate comprehensive bus data
        function generateAllBusRoutes() {
            const allBuses = [];
            let busId = 1;
            
            const locationKeys = Object.keys(locations);
            
            for (let i = 0; i < locationKeys.length; i++) {
                for (let j = 0; j < locationKeys.length; j++) {
                    if (i === j) continue;
                    
                    const fromKey = locationKeys[i];
                    const toKey = locationKeys[j];
                    const fromName = locations[fromKey];
                    const toName = locations[toKey];
                    
                    // Generate buses for different times
                    const timeSlots = ['morning', 'afternoon'];
                    
                    timeSlots.forEach(timeOfDay => {
                        allBuses.push(createBus(
                            busId++, 
                            fromKey, 
                            toKey, 
                            fromName, 
                            toName, 
                            timeOfDay
                        ));
                    });
                    
                    // Add evening buses for popular routes
                    if (isPopularRoute(fromKey, toKey)) {
                        allBuses.push(createBus(
                            busId++, 
                            fromKey, 
                            toKey, 
                            fromName, 
                            toName, 
                            'evening'
                        ));
                    }
                }
            }
            
            return allBuses;
        }
        
        function isPopularRoute(fromKey, toKey) {
            const popularRoutes = [
                ['rajkot', 'ahmedabad'],
                ['rajkot', 'surat'],
                ['morbi', 'rajkot'],
                ['rajkot', 'mumbai'],
                ['mumbai', 'bangalore'],
                ['mumbai', 'pune'],
                ['bangalore', 'chennai']
            ];
            
            return popularRoutes.some(route => 
                (route[0] === fromKey && route[1] === toKey) || 
                (route[0] === toKey && route[1] === fromKey)
            );
        }
        
        function createBus(id, fromKey, toKey, fromName, toName, timeOfDay) {
            let departureMinutes;
            switch(timeOfDay) {
                case 'morning':
                    departureMinutes = 6 * 60 + (id % 6) * 30;
                    break;
                case 'afternoon':
                    departureMinutes = 12 * 60 + (id % 6) * 45;
                    break;
                case 'evening':
                    departureMinutes = 18 * 60 + (id % 4) * 30;
                    break;
            }
            
            const hours = Math.floor(departureMinutes / 60);
            const minutes = departureMinutes % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours > 12 ? hours - 12 : hours;
            const departureTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            
            // Calculate arrival time
            const travelMinutes = 120 + (id % 120);
            const arrivalMinutes = departureMinutes + travelMinutes;
            const arrivalHours = Math.floor(arrivalMinutes / 60);
            const arrivalMins = arrivalMinutes % 60;
            const arrivalPeriod = arrivalHours >= 12 ? 'PM' : 'AM';
            const arrivalDisplayHours = arrivalHours > 12 ? arrivalHours - 12 : arrivalHours;
            const arrivalTime = `${arrivalDisplayHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')} ${arrivalPeriod}`;
            
            // Duration
            const durationHours = Math.floor(travelMinutes / 60);
            const durationMinutes = travelMinutes % 60;
            const durationStr = durationHours > 0 ? 
                `${durationHours} hour${durationHours > 1 ? 's' : ''} ${durationMinutes} mins` : 
                `${durationMinutes} mins`;
            
            // Bus name
            const busNames = [
                `${fromName} Express`,
                `${fromName} - ${toName} Connect`,
                `City Shuttle`,
                `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Service`,
                `Premium Travel`
            ];
            
            const busName = busNames[id % busNames.length];
            
            // Fare calculation
            let baseFare = 200 + (id % 300);
            const busType = busTypes[id % 3];
            if (busType.includes('AC')) baseFare += 50;
            if (busType.includes('Sleeper')) baseFare += 100;
            
            // Seats
            const totalSeats = 40;
            const availableSeats = Math.max(5, totalSeats - (id % 20));
            
            // Bus number
            const busNumber = `BUS${(1000 + id).toString().padStart(4, '0')}`;
            
            // Amenities
            const amenities = busType.includes('AC') ? 
                ['WiFi', 'Charging Ports', 'Water Bottle', 'AC'] : 
                ['Comfort Seats', 'Water Bottle'];
            
            return {
                id: id,
                name: busName,
                from: fromKey,
                to: toKey,
                departure: departureTime,
                arrival: arrivalTime,
                duration: durationStr,
                fare: baseFare,
                type: busType,
                totalSeats: totalSeats,
                availableSeats: availableSeats,
                amenities: amenities,
                route: `${fromName} to ${toName}`,
                busNumber: busNumber,
                timeOfDay: timeOfDay
            };
        }
        
        const busData = generateAllBusRoutes();
        
        // Database simulation
        class Database {
            constructor() {
                this.users = JSON.parse(localStorage.getItem('busUsers')) || [];
                this.bookings = JSON.parse(localStorage.getItem('busBookings')) || [];
                this.busSeats = JSON.parse(localStorage.getItem('busSeats')) || {};
            }

            saveUsers() {
                localStorage.setItem('busUsers', JSON.stringify(this.users));
            }

            saveBookings() {
                localStorage.setItem('busBookings', JSON.stringify(this.bookings));
            }

            saveBusSeats() {
                localStorage.setItem('busSeats', JSON.stringify(this.busSeats));
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
                
                // Mark seats as booked
                this.markSeatsAsBooked(booking.busId, booking.date, booking.seats);
                
                return booking;
            }

            getBookingsByUser(userId) {
                return this.bookings.filter(booking => booking.userId === userId)
                    .map(booking => {
                        const bus = busData.find(b => b.id === booking.busId);
                        return { ...booking, busDetails: bus };
                    });
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
                this.busSeats[key] = [...new Set([...this.busSeats[key], ...seats])];
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

            updateUser(userId, updates) {
                const userIndex = this.users.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    this.users[userIndex] = { ...this.users[userIndex], ...updates };
                    this.saveUsers();
                    return this.users[userIndex];
                }
                return null;
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
                showSection('home');
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
                // Navigation
                $('.nav-link').on('click', handleNavigation);
                
                // Auth buttons
                $('#loginBtn').on('click', showLoginModal);
                $('#registerBtn').on('click', showRegisterModal);
                
                // Modal controls
                $('#closeModal').on('click', closeAuthModal);
                $('#closeForgotModal').on('click', closeForgotModal);
                $('#closeSeatModal').on('click', closeSeatModal);
                $('#closePaymentModal').on('click', closePaymentModal);
                $('#closeProfileModal').on('click', closeProfileModal);
                
                // Auth modal tabs
                $('#loginTab').on('click', () => switchAuthTab('login'));
                $('#registerTab').on('click', () => switchAuthTab('register'));
                $('#switchToRegister').on('click', () => switchAuthTab('register'));
                $('#switchToLogin').on('click', () => switchAuthTab('login'));
                
                // Forgot password
                $('#forgotPasswordLink').on('click', showForgotPasswordModal);
                $('#backToLogin').on('click', backToLoginFromForgot);
                
                // Forms
                $('#loginForm').on('submit', handleLogin);
                $('#registerForm').on('submit', handleRegister);
                $('#searchForm').on('submit', handleSearch);
                $('#profileForm').on('submit', handleProfileUpdate);
                $('#forgotPasswordFormElement').on('submit', handleForgotPassword);
                
                // Dashboard actions
                $('#quickSearch').on('click', () => showSection('search'));
                $('#viewBookings').on('click', () => showSection('bookings'));
                $('#editProfile').on('click', showProfileModal);
                $('#modifySearch').on('click', () => showSection('search'));
                
                // Seat selection
                $(document).on('click', '.seat:not(.booked)', handleSeatSelection);
                $('#proceedToPayment').on('click', showPaymentModal);
                
                // Payment
                $('.payment-option').on('click', selectPaymentMethod);
                $('#confirmPayment').on('click', processPayment);
                
                // Bookings
                $(document).on('click', '.cancel-booking', cancelBooking);
                $('.tab[data-filter]').on('click', filterBookings);
                
                // Time filter
                $('.time-filter-btn').on('click', handleTimeFilter);
                
                // Popular routes
                $('.popular-route').on('click', handlePopularRouteClick);
                
                // View schedule
                $(document).on('click', '.view-schedule', toggleScheduleView);
            }
            
            function showNotification(message, type = 'success') {
                const notification = $('#notification');
                const text = $('#notificationText');
                
                notification.removeClass('success error info').addClass(type);
                text.text(message);
                
                // Set icon based on type
                const icon = notification.find('i');
                icon.removeClass('fa-check-circle fa-exclamation-circle fa-info-circle');
                
                switch(type) {
                    case 'success':
                        icon.addClass('fa-check-circle');
                        break;
                    case 'error':
                        icon.addClass('fa-exclamation-circle');
                        break;
                    case 'info':
                        icon.addClass('fa-info-circle');
                        break;
                }
                
                notification.addClass('show');
                
                setTimeout(() => {
                    notification.removeClass('show');
                }, 3000);
            }
            
            function showSection(section) {
                // Hide all sections
                $('section').hide();
                
                // Remove active class from all nav links
                $('.nav-link').removeClass('active');
                
                // Show selected section
                switch(section) {
                    case 'home':
                        $('#homeSection, #featuresSection').show();
                        $('.nav-link[data-section="home"]').addClass('active');
                        break;
                    case 'search':
                        $('#searchSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        $('html, body').animate({ scrollTop: $('#searchSection').offset().top - 100 }, 500);
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
                        $('html, body').animate({ scrollTop: $('#dashboardSection').offset().top - 100 }, 500);
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
                        $('html, body').animate({ scrollTop: $('#bookingsSection').offset().top - 100 }, 500);
                        break;
                    case 'busList':
                        $('#busListSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        $('html, body').animate({ scrollTop: $('#busListSection').offset().top - 100 }, 500);
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
                    try {
                        currentUser = JSON.parse(userData);
                        updateAuthUI();
                        userBookings = db.getBookingsByUser(currentUser.id);
                    } catch (e) {
                        console.error('Error parsing user data:', e);
                    }
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
                    
                    $('#dashboardLink, #bookingsLink').show();
                    
                    // Attach logout handler
                    $('#logoutBtn').on('click', handleLogout);
                } else {
                    $('#authButtons').html(`
                        <button class="login-btn" id="loginBtn"><i class="fas fa-sign-in-alt"></i> Login</button>
                        <button class="register-btn" id="registerBtn"><i class="fas fa-user-plus"></i> Register</button>
                    `);
                    
                    $('#dashboardLink, #bookingsLink').hide();
                    
                    // Reattach event listeners
                    $('#loginBtn').on('click', showLoginModal);
                    $('#registerBtn').on('click', showRegisterModal);
                }
            }
            
            function showLoginModal() {
                $('#authModal').css('display', 'flex');
                switchAuthTab('login');
            }
            
            function showRegisterModal() {
                $('#authModal').css('display', 'flex');
                switchAuthTab('register');
            }
            
            function switchAuthTab(tab) {
                $('#loginTab, #registerTab').removeClass('active');
                $('#loginContent, #registerContent').removeClass('active');
                
                if (tab === 'login') {
                    $('#loginTab').addClass('active');
                    $('#loginContent').addClass('active');
                    $('#modalTitle').text('Login to Your Account');
                } else {
                    $('#registerTab').addClass('active');
                    $('#registerContent').addClass('active');
                    $('#modalTitle').text('Create an Account');
                }
                
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
                clearFormErrors();
            }
            
            function closeForgotModal() {
                $('#forgotPasswordModal').css('display', 'none');
                $('#forgotEmail').val('');
                $('#forgotSuccessMessage').hide();
            }
            
            function closeSeatModal() {
                $('#seatSelectionModal').css('display', 'none');
                selectedSeats = [];
            }
            
            function closePaymentModal() {
                $('#paymentModal').css('display', 'none');
                selectedPaymentMethod = null;
                $('.payment-option').removeClass('selected');
                $('#confirmPayment').prop('disabled', true);
            }
            
            function closeProfileModal() {
                $('#profileModal').css('display', 'none');
                clearFormErrors();
            }
            
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            function validatePassword(password) {
                return password.length >= 6;
            }
            
            function validatePhone(phone) {
                const re = /^\d{10}$/;
                return re.test(phone);
            }
            
            function validateName(name) {
                return name.trim().length >= 2;
            }
            
            function clearFormErrors() {
                $('.validation-message').hide();
                $('.form-input').removeClass('error-border success-border');
            }
            
            function showFieldError(fieldId, message) {
                $(`#${fieldId}Error`).text(message).show();
                $(`#${fieldId}`).addClass('error-border').removeClass('success-border');
            }
            
            function showFieldSuccess(fieldId) {
                $(`#${fieldId}Error`).hide();
                $(`#${fieldId}`).addClass('success-border').removeClass('error-border');
            }
            
            function setupRealTimeValidation() {
                // Email validation
                $('#loginEmail, #regEmail, #forgotEmail').on('input', function() {
                    const email = $(this).val();
                    const fieldId = $(this).attr('id');
                    
                    if (!email) {
                        $(this).removeClass('error-border success-border');
                        $(`#${fieldId}Error`).hide();
                    } else if (validateEmail(email)) {
                        showFieldSuccess(fieldId);
                    } else {
                        showFieldError(fieldId, 'Please enter a valid email address');
                    }
                });
                
                // Password validation
                $('#loginPassword, #regPassword, #profilePassword').on('input', function() {
                    const password = $(this).val();
                    const fieldId = $(this).attr('id');
                    
                    if (!password) {
                        $(this).removeClass('error-border success-border');
                        $(`#${fieldId}Error`).hide();
                    } else if (validatePassword(password)) {
                        showFieldSuccess(fieldId);
                    } else {
                        showFieldError(fieldId, 'Password must be at least 6 characters');
                    }
                });
                
                // Name validation
                $('#regName, #profileName').on('input', function() {
                    const name = $(this).val();
                    const fieldId = $(this).attr('id');
                    
                    if (!name) {
                        $(this).removeClass('error-border success-border');
                        $(`#${fieldId}Error`).hide();
                    } else if (validateName(name)) {
                        showFieldSuccess(fieldId);
                    } else {
                        showFieldError(fieldId, 'Name must be at least 2 characters');
                    }
                });
                
                // Phone validation
                $('#regPhone, #profilePhone').on('input', function() {
                    const phone = $(this).val();
                    const fieldId = $(this).attr('id');
                    
                    if (!phone) {
                        $(this).removeClass('error-border success-border');
                        $(`#${fieldId}Error`).hide();
                    } else if (validatePhone(phone)) {
                        showFieldSuccess(fieldId);
                    } else {
                        showFieldError(fieldId, 'Please enter a valid 10-digit phone number');
                    }
                });
                
                // Confirm password validation
                $('#regConfirmPassword, #profileConfirmPassword').on('input', function() {
                    const confirmPassword = $(this).val();
                    const fieldId = $(this).attr('id');
                    const passwordId = fieldId.replace('Confirm', '');
                    const password = $(`#${passwordId}`).val();
                    
                    if (!confirmPassword) {
                        $(this).removeClass('error-border success-border');
                        $(`#${fieldId}Error`).hide();
                    } else if (password === confirmPassword) {
                        showFieldSuccess(fieldId);
                    } else {
                        showFieldError(fieldId, 'Passwords do not match');
                    }
                });
            }
            
            function handleLogin(e) {
                e.preventDefault();
                
                const email = $('#loginEmail').val();
                const password = $('#loginPassword').val();
                let isValid = true;
                
                // Clear previous errors
                clearFormErrors();
                
                // Validate email
                if (!email) {
                    showFieldError('loginEmail', 'Email is required');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    showFieldError('loginEmail', 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Validate password
                if (!password) {
                    showFieldError('loginPassword', 'Password is required');
                    isValid = false;
                } else if (!validatePassword(password)) {
                    showFieldError('loginPassword', 'Password must be at least 6 characters');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Check credentials
                const user = db.getUserByEmail(email);
                
                if (!user) {
                    showNotification('No account found with this email', 'error');
                    showFieldError('loginEmail', 'No account found with this email');
                    return;
                }
                
                if (user.password !== password) {
                    showNotification('Invalid password', 'error');
                    showFieldError('loginPassword', 'Invalid password');
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
                let isValid = true;
                
                // Clear previous errors
                clearFormErrors();
                
                // Validate name
                if (!name) {
                    showFieldError('regName', 'Name is required');
                    isValid = false;
                } else if (!validateName(name)) {
                    showFieldError('regName', 'Name must be at least 2 characters');
                    isValid = false;
                }
                
                // Validate email
                if (!email) {
                    showFieldError('regEmail', 'Email is required');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    showFieldError('regEmail', 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Validate phone
                if (!phone) {
                    showFieldError('regPhone', 'Phone number is required');
                    isValid = false;
                } else if (!validatePhone(phone)) {
                    showFieldError('regPhone', 'Please enter a valid 10-digit phone number');
                    isValid = false;
                }
                
                // Validate password
                if (!password) {
                    showFieldError('regPassword', 'Password is required');
                    isValid = false;
                } else if (!validatePassword(password)) {
                    showFieldError('regPassword', 'Password must be at least 6 characters');
                    isValid = false;
                }
                
                // Validate confirm password
                if (!confirmPassword) {
                    showFieldError('regConfirmPassword', 'Please confirm your password');
                    isValid = false;
                } else if (password !== confirmPassword) {
                    showFieldError('regConfirmPassword', 'Passwords do not match');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Check if user already exists
                if (db.getUserByEmail(email)) {
                    showNotification('User with this email already exists', 'error');
                    showFieldError('regEmail', 'Email already registered');
                    return;
                }
                
                // Create new user
                const user = {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password: password
                };
                
                const newUser = db.addUser(user);
                currentUser = newUser;
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                userBookings = [];
                updateAuthUI();
                closeAuthModal();
                showNotification('Registration successful! Welcome to Bus Reservation', 'success');
                showSection('dashboard');
            }
            
            function handleSearch(e) {
                e.preventDefault();
                
                const from = $('#from').val();
                const to = $('#to').val();
                const date = $('#date').val();
                let isValid = true;
                
                // Clear previous errors
                $('#fromError, #toError, #dateError').hide();
                $('#from, #to, #date').removeClass('error-border');
                
                // Validate from
                if (!from) {
                    $('#fromError').show();
                    $('#from').addClass('error-border');
                    isValid = false;
                }
                
                // Validate to
                if (!to) {
                    $('#toError').show();
                    $('#to').addClass('error-border');
                    isValid = false;
                }
                
                // Validate date
                if (!date) {
                    $('#dateError').show();
                    $('#date').addClass('error-border');
                    isValid = false;
                } else {
                    const selectedDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        $('#dateError').text('Please select a future date').show();
                        $('#date').addClass('error-border');
                        isValid = false;
                    }
                }
                
                // Check if from and to are same
                if (from && to && from === to) {
                    $('#toError').text('Departure and destination cannot be the same').show();
                    $('#to').addClass('error-border');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Show loading
                $('#busResults').html(`
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                `);
                
                // Simulate API delay
                setTimeout(() => {
                    const filteredBuses = busData.filter(bus => 
                        bus.from === from && bus.to === to
                    );
                    
                    displaySearchResults(filteredBuses, from, to, date);
                }, 800);
            }
            
            function displaySearchResults(buses, from, to, date) {
                const fromName = locations[from];
                const toName = locations[to];
                const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                $('#resultsCount').text(`${buses.length} bus${buses.length !== 1 ? 'es' : ''} found for ${fromName} to ${toName} on ${formattedDate}`);
                
                $('#busResults').empty();
                
                if (buses.length === 0) {
                    $('#busResults').html(`
                        <div class="no-results">
                            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px;"></i>
                            <h3>No buses found for your search</h3>
                            <p>Try changing your departure or destination points</p>
                        </div>
                    `);
                } else {
                    // Apply time filter
                    const filteredBuses = applyTimeFilter(buses, currentTimeFilter);
                    
                    filteredBuses.forEach(bus => {
                        const busCard = `
                            <div class="bus-card" data-bus-id="${bus.id}">
                                <div class="bus-info">
                                    <h3 class="bus-name">
                                        ${bus.name}
                                        <span style="font-size: 14px; color: var(--text-light); margin-left: 10px;">
                                            ${bus.timeOfDay === 'morning' ? 'Morning' : bus.timeOfDay === 'afternoon' ? 'Afternoon' : 'Evening'} Service
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
                                                <span class="timing-label">Bus Type:</span>
                                                <span class="timing-value"> ${bus.type}</span>
                                            </div>
                                            <div>
                                                <span class="timing-label">Bus No:</span>
                                                <span class="timing-value"> ${bus.busNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bus-details">
                                        ${bus.amenities.map(amenity => `<span><i class="fas fa-check"></i> ${amenity}</span>`).join('')}
                                    </div>
                                    <button class="action-btn view-schedule" style="margin-top: 10px;">
                                        <i class="fas fa-clock"></i> View Schedule Details
                                    </button>
                                    <div class="route-map" id="routeMap-${bus.id}">
                                        <h4>Route Information:</h4>
                                        <div style="padding: 10px; background-color: white; border-radius: 5px; margin-top: 10px;">
                                            <p><strong>${fromName} to ${toName}</strong></p>
                                            <p>Departure: ${bus.departure}</p>
                                            <p>Arrival: ${bus.arrival}</p>
                                            <p>Duration: ${bus.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bus-fare">
                                    <div class="fare-amount">₹${bus.fare}</div>
                                    <div style="margin: 10px 0; color: var(--text-light);">
                                        <i class="fas fa-chair"></i> ${bus.availableSeats} seats available
                                    </div>
                                    <button class="book-btn" data-bus-id="${bus.id}" data-date="${date}">
                                        ${bus.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                                    </button>
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
                    
                    // Attach schedule view handlers
                    $('.view-schedule').on('click', function() {
                        const busCard = $(this).closest('.bus-card');
                        const routeMap = busCard.find('.route-map');
                        routeMap.slideToggle();
                    });
                }
                
                showSection('busList');
            }
            
            function applyTimeFilter(buses, timeFilter) {
                if (timeFilter === 'all') return buses;
                
                return buses.filter(bus => {
                    const departureTime = bus.departure;
                    const time = departureTime.split(' ')[0];
                    const period = departureTime.split(' ')[1];
                    let [hours, minutes] = time.split(':').map(Number);
                    
                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    
                    const departureHour = hours;
                    
                    switch(timeFilter) {
                        case 'morning':
                            return departureHour >= 5 && departureHour < 12;
                        case 'afternoon':
                            return departureHour >= 12 && departureHour < 17;
                        case 'evening':
                            return departureHour >= 17 && departureHour < 22;
                        default:
                            return true;
                    }
                });
            }
            
            function handleTimeFilter() {
                currentTimeFilter = $(this).data('time');
                $('.time-filter-btn').removeClass('active');
                $(this).addClass('active');
                
                // Re-filter current search results
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
                const busId = $(this).closest('.bus-card').data('bus-id');
                $(`#routeMap-${busId}`).slideToggle();
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
                $('#selectedBusRoute').text(`${locations[bus.from]} to ${locations[bus.to]}`);
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
                    $(this).removeClass('selected');
                } else {
                    if (selectedSeats.length < 5) {
                        selectedSeats.push(seat);
                        $(this).addClass('selected');
                    } else {
                        showNotification('Maximum 5 seats per booking', 'error');
                        return;
                    }
                }
                
                updateSeatSelection();
            }
            
            function updateSeatSelection() {
                $('#selectedSeatsCount').text(selectedSeats.length);
                const totalAmount = selectedSeats.length * currentBooking.bus.fare;
                $('#totalAmount').text(totalAmount);
                
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
                        <p><strong>Route:</strong> ${locations[currentBooking.bus.from]} to ${locations[currentBooking.bus.to]}</p>
                        <p><strong>Date:</strong> ${new Date(currentBooking.date).toLocaleDateString('en-IN')}</p>
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
                
                // Show processing
                $('#confirmPayment').html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
                
                setTimeout(() => {
                    // Create booking
                    const booking = {
                        busId: currentBooking.bus.id,
                        userId: currentUser.id,
                        date: currentBooking.date,
                        seats: [...selectedSeats],
                        totalAmount: selectedSeats.length * currentBooking.bus.fare,
                        status: 'upcoming',
                        passengerName: currentUser.name,
                        paymentMethod: selectedPaymentMethod,
                        busDetails: currentBooking.bus
                    };
                    
                    const newBooking = db.addBooking(booking);
                    userBookings.push(newBooking);
                    
                    // Reset everything
                    $('#paymentModal').css('display', 'none');
                    selectedSeats = [];
                    selectedPaymentMethod = null;
                    $('#confirmPayment').html('<i class="fas fa-lock"></i> Pay Now').prop('disabled', true);
                    
                    // Show success
                    showNotification(`Booking confirmed! Your booking ID is ${newBooking.id}`, 'success');
                    
                    // Update dashboard and go to bookings
                    loadDashboard();
                    showSection('bookings');
                }, 1500);
            }
            
            function loadDashboard() {
                if (!currentUser) return;
                
                $('#userName').text(currentUser.name);
                
                const totalBookings = userBookings.length;
                const upcomingTrips = userBookings.filter(b => b.status === 'upcoming').length;
                const totalSpent = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
                
                $('#totalBookings').text(totalBookings);
                $('#upcomingTrips').text(upcomingTrips);
                $('#totalSpent').text(totalSpent);
                
                loadRecentBookings();
            }
            
            function loadRecentBookings() {
                const recentBookings = userBookings.slice(-3).reverse();
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
                                <p>${new Date(booking.date).toLocaleDateString()} | ${bus?.departure || ''}</p>
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
                
                filteredBookings.reverse().forEach(booking => {
                    const bus = booking.busDetails;
                    const bookingCard = `
                        <div class="booking-card">
                            <div style="flex: 1;">
                                <h4>${bus?.name || 'Bus'}</h4>
                                <p><strong>Booking ID:</strong> ${booking.id}</p>
                                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()} | ${bus?.departure || ''}</p>
                                <p><strong>Route:</strong> ${bus?.route || 'N/A'}</p>
                                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                                <p><strong>Booked on:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <div style="text-align: right;">
                                <span class="booking-status status-${booking.status}">
                                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <h3 style="margin: 10px 0;">₹${booking.totalAmount}</h3>
                                ${booking.status === 'upcoming' ? 
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
                let isValid = true;
                
                // Clear previous errors
                clearFormErrors();
                
                // Validate name
                if (!name) {
                    showFieldError('profileName', 'Name is required');
                    isValid = false;
                } else if (!validateName(name)) {
                    showFieldError('profileName', 'Name must be at least 2 characters');
                    isValid = false;
                }
                
                // Validate phone
                if (!phone) {
                    showFieldError('profilePhone', 'Phone number is required');
                    isValid = false;
                } else if (!validatePhone(phone)) {
                    showFieldError('profilePhone', 'Please enter a valid 10-digit phone number');
                    isValid = false;
                }
                
                // Validate password if provided
                if (password) {
                    if (!validatePassword(password)) {
                        showFieldError('profilePassword', 'Password must be at least 6 characters');
                        isValid = false;
                    }
                    
                    if (password !== confirmPassword) {
                        showFieldError('profileConfirmPassword', 'Passwords do not match');
                        isValid = false;
                    }
                }
                
                if (!isValid) return;
                
                // Update user
                const updates = {
                    name: name.trim(),
                    phone: phone.trim()
                };
                
                if (password) {
                    updates.password = password;
                }
                
                const updatedUser = db.updateUser(currentUser.id, updates);
                
                if (updatedUser) {
                    currentUser = updatedUser;
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    updateAuthUI();
                    
                    closeProfileModal();
                    showNotification('Profile updated successfully', 'success');
                    loadDashboard();
                } else {
                    showNotification('Failed to update profile', 'error');
                }
            }
            
            function handleForgotPassword(e) {
                e.preventDefault();
                
                const email = $('#forgotEmail').val();
                
                if (!email) {
                    showFieldError('forgotEmail', 'Email is required');
                    return;
                }
                
                if (!validateEmail(email)) {
                    showFieldError('forgotEmail', 'Please enter a valid email address');
                    return;
                }
                
                // Check if user exists
                const user = db.getUserByEmail(email);
                if (!user) {
                    showFieldError('forgotEmail', 'No account found with this email');
                    return;
                }
                
                // Simulate sending reset email
                $('#forgotSuccessMessage').show();
                
                setTimeout(() => {
                    $('#forgotSuccessMessage').hide();
                    $('#forgotEmail').val('');
                    closeForgotModal();
                    showLoginModal();
                    showNotification('Password reset link sent to your email', 'success');
                }, 2000);
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
        });
