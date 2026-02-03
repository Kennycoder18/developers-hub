 // DOM Elements
        const formcontainer = document.getElementById('form-container');
        const appcontainer = document.getElementById('app-container');
        const loginToggle = document.getElementById('loginToggle');
        const signupToggle = document.getElementById('signupToggle');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginFormElement = document.getElementById('loginFormElement');
        const signupFormElement = document.getElementById('signupFormElement');
        const loginMessage = document.getElementById('loginMessage');
        const signupMessage = document.getElementById('signupMessage');
        const logoutBtn = document.getElementById('logoutBtn');
        const headerUsername = document.getElementById('headerUsername');
        const userAvatar = document.getElementById('userAvatar');
        const totalUsersElement = document.getElementById('totalUsers');

        // Initialize users in localStorage if not exists
        if (!localStorage.getItem('adminUsers')) {
            // Create a default admin user
            const defaultUser = {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123', // In a real app, this should be hashed
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('adminUsers', JSON.stringify([defaultUser]));
            localStorage.setItem('totalUsers', '1');
        }

        // Update total users count
        function updateTotalUsers() {
            const users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            totalUsersElement.textContent = users.length;
        }

        // Form toggle functionality
        loginToggle.addEventListener('click', () => {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            loginMessage.style.display = 'none';
            signupMessage.style.display = 'none';
        });

        signupToggle.addEventListener('click', () => {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
            loginMessage.style.display = 'none';
            signupMessage.style.display = 'none';
        });

        // Sign Up Form Submission
        signupFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (password !== confirmPassword) {
                showMessage(signupMessage, 'Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage(signupMessage, 'Password must be at least 6 characters long!', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const userExists = users.some(user => 
                user.username.toLowerCase() === username.toLowerCase() || 
                user.email.toLowerCase() === email.toLowerCase()
            );
            
            if (userExists) {
                showMessage(signupMessage, 'Username or email already exists!', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                username,
                email,
                password, // In a real app, this should be hashed
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('adminUsers', JSON.stringify(users));
            localStorage.setItem('totalUsers', users.length.toString());
            
            showMessage(signupMessage, 'Account created successfully! Please login.', 'success');
            
            // Clear form
            signupFormElement.reset();
            
            // Switch to login form
            setTimeout(() => {
                loginToggle.click();
            }, 1500);
        });

        // Login Form Submission
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Check credentials
            const users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() && 
                u.password === password
            );
            
            if (user) {
                // Successful login
                loginUser(user);
            } else {
                showMessage(loginMessage, 'Invalid username or password!', 'error');
            }
        });

        // Login function
        function loginUser(user) {
            // Store current user in session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update UI with username
            headerUsername.textContent = user.username;
            userAvatar.textContent = user.username.charAt(0).toUpperCase();
            
            // Update total users count
            updateTotalUsers();
            
            // Show dashboard and hide form
            formcontainer.style.display = 'none';
            appcontainer.style.display = 'block';
            
            // Show welcome message
            showMessage(loginMessage, `Welcome back, ${user.username}!`, 'success');
        }

        // Logout functionality
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            formcontainer.style.display = 'block';
            appcontainer.style.display = 'none';
            loginFormElement.reset();
            signupFormElement.reset();
            loginMessage.style.display = 'none';
            signupMessage.style.display = 'none';
            
            // Switch to login form
            loginToggle.click();
        });

        // Show message function
        function showMessage(element, text, type) {
            element.textContent = text;
            element.className = `message ${type}`;
            element.style.display = 'block';
            
            // Auto-hide success messages after 3 seconds
            if (type === 'success') {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 3000);
            }
        }

        // Check if user is already logged in
        function checkLoggedIn() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                loginUser(user);
            }
        }

        // Initialize the app
        function initApp() {
            checkLoggedIn();
            updateTotalUsers();
        }

        // Run initialization when page loads
        document.addEventListener('DOMContentLoaded', initApp);