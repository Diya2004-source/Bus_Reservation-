        // Bus data configuration
        const cities = {
            'mumbai': 'Mumbai',
            'delhi': 'Delhi',
            'bangalore': 'Bangalore',
            'chennai': 'Chennai',
            'kolkata': 'Kolkata',
            'hyderabad': 'Hyderabad',
            'pune': 'Pune',
            'ahmedabad': 'Ahmedabad'
        };

        // Generate bus data for EVERY route combination
        function generateAllBusRoutes() {
            const busData = [];
            let busId = 1;
            
            const cityKeys = Object.keys(cities);
            
            // Generate buses for all possible combinations (8 cities = 56 routes)
            for (let i = 0; i < cityKeys.length; i++) {
                for (let j = 0; j < cityKeys.length; j++) {
                    if (i === j) continue; // Skip same city
                    
                    const fromKey = cityKeys[i];
                    const toKey = cityKeys[j];
                    const fromName = cities[fromKey];
                    const toName = cities[toKey];
                    
                    // Generate 2-3 buses per route (morning, afternoon, evening)
                    const busTypes = ['AC', 'Non-AC', 'AC Sleeper'];
                    
                    // Create morning bus
                    busData.push(createBus(
                        busId++, 
                        fromKey, 
                        toKey, 
                        fromName, 
                        toName, 
                        'morning',
                        busTypes[busId % 3]
                    ));
                    
                    // Create afternoon bus
                    busData.push(createBus(
                        busId++, 
                        fromKey, 
                        toKey, 
                        fromName, 
                        toName, 
                        'afternoon',
                        busTypes[(busId + 1) % 3]
                    ));
                    
                    // Create evening bus for longer routes
                    if (isLongRoute(fromKey, toKey)) {
                        busData.push(createBus(
                            busId++, 
                            fromKey, 
                            toKey, 
                            fromName, 
                            toName, 
                            'evening',
                            busTypes[(busId + 2) % 3]
                        ));
                    }
                }
            }
            
            console.log(`Generated ${busData.length} buses for all ${cityKeys.length * (cityKeys.length - 1)} routes`);
            return busData;
        }
        
        function isLongRoute(fromKey, toKey) {
            // Define some longer routes that should have evening buses too
            const longRoutes = [
                ['mumbai', 'delhi'],
                ['mumbai', 'kolkata'],
                ['delhi', 'chennai'],
                ['delhi', 'bangalore'],
                ['bangalore', 'delhi'],
                ['kolkata', 'mumbai'],
                ['chennai', 'delhi']
            ];
            
            return longRoutes.some(route => 
                (route[0] === fromKey && route[1] === toKey) || 
                (route[0] === toKey && route[1] === fromKey)
            );
        }
        
        function createBus(id, fromKey, toKey, fromName, toName, timeOfDay, busType) {
            // Determine departure time based on time of day
            let departureTime;
            let departureHour;
            
            switch(timeOfDay) {
                case 'morning':
                    departureHour = 6 + (id % 6); // 6:00 AM to 11:30 AM
                    break;
                case 'afternoon':
                    departureHour = 12 + (id % 6); // 12:00 PM to 5:30 PM
                    break;
                case 'evening':
                    departureHour = 18 + (id % 4); // 6:00 PM to 9:30 PM
                    break;
            }
            
            const minutes = (id % 2) === 0 ? '00' : '30';
            const period = departureHour >= 12 ? 'PM' : 'AM';
            const displayHour = departureHour > 12 ? departureHour - 12 : departureHour;
            departureTime = `${displayHour}:${minutes} ${period}`;
            
            // Calculate travel time based on route (1-8 hours)
            const travelHours = 1 + Math.floor(Math.random() * 7) + Math.floor(Math.random() * 2);
            let arrivalHour = departureHour + travelHours;
            const arrivalPeriod = arrivalHour >= 12 ? 'PM' : 'AM';
            const arrivalDisplayHour = arrivalHour > 12 ? arrivalHour - 12 : arrivalHour;
            const arrivalTime = `${arrivalDisplayHour}:${minutes} ${arrivalPeriod}`;
            
            // Generate bus name
            const busNames = [
                `${fromName} Express`,
                `${fromName}-${toName} Connect`,
                `Royal Travels`,
                `SRS Travels`,
                `Orange Tours`,
                `VRL Travels`,
                `National Express`,
                `City Shuttle`,
                `Comfort Travels`
            ];
            
            const busName = busNames[id % busNames.length];
            
            // Calculate fare - ALL UNDER ₹2000
            // Base fare based on travel hours
            let baseFare = 200 + (travelHours * 100); // ₹200 + ₹100 per hour
            if (busType.includes('AC')) baseFare += 150;
            if (busType.includes('Sleeper')) baseFare += 200;
            
            // Add some random variation
            baseFare += Math.floor(Math.random() * 200) - 100;
            
            // Ensure total doesn't exceed ₹2000
            if (baseFare > 2000) baseFare = 2000;
            if (baseFare < 300) baseFare = 300; // Minimum fare
            
            // Available seats
            const totalSeats = 40;
            const availableSeats = Math.floor(Math.random() * 25) + 5; // 5-30 seats
            
            // Amenities
            const amenities = busType.includes('AC') ? 
                ['Charging Points', 'Water Bottle', 'Blanket'] : 
                ['Comfort Seats', 'Water Bottle', 'Reading Light'];
            
            // Bus number
            const busNumber = `BUS${String(id).padStart(4, '0')}`;
            
            return {
                id: id,
                name: busName,
                from: fromKey,
                to: toKey,
                departure: departureTime,
                arrival: arrivalTime,
                duration: `${travelHours} hours`,
                fare: baseFare,
                type: busType,
                totalSeats: totalSeats,
                availableSeats: availableSeats,
                amenities: amenities,
                busNumber: busNumber,
                timeOfDay: timeOfDay
            };
        }
        
        const busData = generateAllBusRoutes();
        let currentTimeFilter = 'all';

        // User storage functions
        function getUsers() {
            return JSON.parse(localStorage.getItem('busUsers')) || [];
        }

        function saveUser(user) {
            const users = getUsers();
            users.push(user);
            localStorage.setItem('busUsers', JSON.stringify(users));
        }

        function findUserByEmail(email) {
            const users = getUsers();
            return users.find(user => user.email === email);
        }

        $(document).ready(function() {
            // Initialize the application
            initApp();
            
            function initApp() {
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
                $('.footer-section a[data-section]').on('click', function(e) {
                    e.preventDefault();
                    const section = $(this).data('section');
                    showSection(section);
                });
                
                // Get Started button
                $('#getStartedBtn').on('click', function() {
                    showSection('search');
                });
                
                // Auth buttons
                $('#loginBtn').on('click', showLoginModal);
                $('#registerBtn').on('click', showRegisterModal);
                
                // Modal controls
                $('#closeModal').on('click', closeAuthModal);
                $('#closeForgotModal').on('click', closeForgotModal);
                
                // Auth modal tabs
                $('#loginTab').on('click', () => switchAuthTab('login'));
                $('#registerTab').on('click', () => switchAuthTab('register'));
                $('#switchToRegister').on('click', () => switchAuthTab('register'));
                $('#switchToLogin').on('click', () => switchAuthTab('login'));
                
                // Forgot password
                $('#forgotPasswordLink').on('click', function(e) {
                    e.preventDefault();
                    showForgotPasswordModal();
                });
                $('#backToLogin').on('click', function(e) {
                    e.preventDefault();
                    closeForgotModal();
                    showLoginModal();
                });
                
                // Forms
                $('#loginForm').on('submit', handleLogin);
                $('#registerForm').on('submit', handleRegister);
                $('#searchForm').on('submit', handleSearch);
                $('#forgotPasswordFormElement').on('submit', handleForgotPassword);
                
                // Modify search
                $('#modifySearch').on('click', function() {
                    showSection('search');
                });
                
                // Popular routes
                $('.popular-route').on('click', handlePopularRouteClick);
                
                // Time filter
                $('.time-filter-btn').on('click', handleTimeFilter);
                
                // View schedule buttons (dynamic)
                $(document).on('click', '.view-schedule', toggleScheduleView);
                
                // Login to book buttons (dynamic)
                $(document).on('click', '.login-to-book-btn', function() {
                    showLoginModal();
                    showNotification('Please login to book tickets', 'info');
                });
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
                        $('html, body').animate({ scrollTop: 0 }, 500);
                        break;
                    case 'search':
                        $('#searchSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        $('html, body').animate({ 
                            scrollTop: $('#searchSection').offset().top - 80 
                        }, 500);
                        break;
                    case 'contact':
                        $('#contactSection').show();
                        $('.nav-link[data-section="contact"]').addClass('active');
                        $('html, body').animate({ 
                            scrollTop: $('#contactSection').offset().top - 80 
                        }, 500);
                        break;
                    case 'busList':
                        $('#busListSection').show();
                        $('.nav-link[data-section="search"]').addClass('active');
                        $('html, body').animate({ 
                            scrollTop: $('#busListSection').offset().top - 80 
                        }, 500);
                        break;
                }
            }
            
            function handleNavigation(e) {
                e.preventDefault();
                const section = $(this).data('section');
                showSection(section);
            }
            
            function showLoginModal() {
                $('#authModal').css('display', 'flex');
                switchAuthTab('login');
            }
            
            function showRegisterModal() {
                $('#authModal').css('display', 'flex');
                switchAuthTab('register');
            }
            
            function showForgotPasswordModal() {
                $('#authModal').css('display', 'none');
                $('#forgotPasswordModal').css('display', 'flex');
                clearFormErrors();
                $('#forgotSuccessMessage').hide();
                $('#forgotEmail').val('');
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
            
            function closeAuthModal() {
                $('#authModal').css('display', 'none');
                clearFormErrors();
                // Clear form fields
                $('#loginEmail, #loginPassword, #regName, #regEmail, #regPhone, #regPassword, #regConfirmPassword').val('');
            }
            
            function closeForgotModal() {
                $('#forgotPasswordModal').css('display', 'none');
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
                $('#loginPassword, #regPassword').on('input', function() {
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
                $('#regName').on('input', function() {
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
                $('#regPhone').on('input', function() {
                    const phone = $(this).val().replace(/\D/g, '');
                    $(this).val(phone);
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
                $('#regConfirmPassword').on('input', function() {
                    const confirmPassword = $(this).val();
                    const fieldId = $(this).attr('id');
                    const password = $('#regPassword').val();
                    
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
                
                // Check if user exists
                const user = findUserByEmail(email);
                if (!user) {
                    showNotification('No account found with this email. Please register.', 'error');
                    showFieldError('loginEmail', 'No account found with this email');
                    return;
                }
                
                // Check password
                if (user.password !== password) {
                    showNotification('Incorrect password. Please try again.', 'error');
                    showFieldError('loginPassword', 'Incorrect password');
                    return;
                }
                
                // Login successful
                showNotification('Login successful! Welcome back, ' + user.name, 'success');
                closeAuthModal();
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
                if (findUserByEmail(email)) {
                    showNotification('User with this email already exists', 'error');
                    showFieldError('regEmail', 'Email already registered');
                    return;
                }
                
                // Create user object
                const user = {
                    id: Date.now(),
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password: password,
                    createdAt: new Date().toISOString()
                };
                
                // Save user to localStorage
                saveUser(user);
                
                // Show success notification
                showNotification('Account created successfully! You can now login.', 'success');
                closeAuthModal();
            }
            
            function handleForgotPassword(e) {
                e.preventDefault();
                
                const email = $('#forgotEmail').val();
                let isValid = true;
                
                // Clear previous errors
                $('#forgotEmailError').hide();
                $('#forgotEmail').removeClass('error-border success-border');
                
                // Validate email
                if (!email) {
                    $('#forgotEmailError').text('Email is required').show();
                    $('#forgotEmail').addClass('error-border');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    $('#forgotEmailError').text('Please enter a valid email address').show();
                    $('#forgotEmail').addClass('error-border');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Check if user exists
                const user = findUserByEmail(email);
                if (!user) {
                    $('#forgotEmailError').text('No account found with this email').show();
                    $('#forgotEmail').addClass('error-border');
                    return;
                }
                
                // Simulate sending reset email
                $('#forgotSuccessMessage').show();
                
                // Show success notification
                showNotification('Password reset link has been sent to your email!', 'success');
                
                // Reset form after 3 seconds and close modal
                setTimeout(() => {
                    $('#forgotSuccessMessage').hide();
                    $('#forgotEmail').val('');
                    closeForgotModal();
                    showLoginModal();
                }, 3000);
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
                        <p>Searching for buses...</p>
                    </div>
                `);
                
                // Simulate API delay
                setTimeout(() => {
                    const filteredBuses = busData.filter(bus => 
                        bus.from === from && bus.to === to
                    );
                    
                    displaySearchResults(filteredBuses, from, to, date);
                }, 1000);
            }
            
            function displaySearchResults(buses, from, to, date) {
                const fromName = cities[from];
                const toName = cities[to];
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
                            <p>Try changing your departure or destination cities</p>
                            <p>Or try searching for these popular routes:</p>
                            <div style="margin-top: 20px;">
                                <button class="search-btn popular-route-btn" data-from="mumbai" data-to="pune" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Mumbai to Pune
                                </button>
                                <button class="search-btn popular-route-btn" data-from="delhi" data-to="jaipur" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Delhi to Jaipur
                                </button>
                                <button class="search-btn popular-route-btn" data-from="bangalore" data-to="chennai" style="margin: 5px;">
                                    <i class="fas fa-route"></i> Bangalore to Chennai
                                </button>
                            </div>
                        </div>
                    `);
                    
                    // Attach click handlers to popular route buttons
                    $('.popular-route-btn').on('click', function() {
                        const from = $(this).data('from');
                        const to = $(this).data('to');
                        $('#from').val(from);
                        $('#to').val(to);
                        $('#searchForm').submit();
                    });
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
                                        <span><i class="fas fa-chair"></i> ${bus.availableSeats} seats available</span>
                                    </div>
                                    <button class="view-btn view-schedule" style="margin-top: 10px;">
                                        <i class="fas fa-info-circle"></i> View Details
                                    </button>
                                    <div class="route-map" id="routeMap-${bus.id}" style="display: none; margin-top: 15px; padding: 15px; background-color: var(--light-mint); border-radius: 8px;">
                                        <h4>Bus Details:</h4>
                                        <p><strong>Operator:</strong> ${bus.name}</p>
                                        <p><strong>Bus Number:</strong> ${bus.busNumber}</p>
                                        <p><strong>Type:</strong> ${bus.type}</p>
                                        <p><strong>Available Seats:</strong> ${bus.availableSeats}</p>
                                        <p><strong>Route:</strong> ${cities[bus.from]} → ${cities[bus.to]}</p>
                                        <p><strong>Departure:</strong> ${bus.departure}</p>
                                        <p><strong>Arrival:</strong> ${bus.arrival}</p>
                                        <p><strong>Duration:</strong> ${bus.duration}</p>
                                    </div>
                                </div>
                                <div class="bus-fare">
                                    <div class="fare-amount">₹${bus.fare}</div>
                                    <button class="view-btn login-to-book-btn" data-bus-id="${bus.id}">
                                        <i class="fas fa-sign-in-alt"></i> Login to Book
                                    </button>
                                    <div style="margin-top: 10px; font-size: 12px; color: var(--text-light);">
                                        <i class="fas fa-info-circle"></i> Fare per seat
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#busResults').append(busCard);
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