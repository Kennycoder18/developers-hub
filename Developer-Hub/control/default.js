// Create twinkling stars
        function createStars() {
            const starsContainer = document.getElementById('stars-container');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random properties
                const size = Math.random() * 3 + 1;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 5;
                
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.opacity = Math.random() * 0.5 + 0.2;
                star.style.setProperty('--duration', `${duration}s`);
                star.style.animationDelay = `${delay}s`;
                
                starsContainer.appendChild(star);
            }
        }

        // Modal functionality
        const loginModal = document.getElementById('loginModal');
        const openSigninBtns = document.querySelectorAll('#openSignin, #heroSignin, #ctaSignin');
        const closeModalBtn = document.getElementById('closeModal');
        const modalTitle = document.getElementById('modalTitle');
        const loginForm = document.getElementById('loginForm');
        const switchToSignupBtn = document.getElementById('switchToSignup');
        const switchToSignupLink = document.getElementById('switchToSignupLink');
        const signupSwitch = document.getElementById('signupSwitch');
        let isSignupMode = false;

        //Open modal
        openSigninBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        //Close modal
        closeModalBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

       // Close modal when clicking outside
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Switch between login and signup
        function switchToSignup() {
            isSignupMode = true;
            modalTitle.textContent = 'Create DevHub Account';
            loginForm.innerHTML = `
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" placeholder="Enter your full name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Create a strong password" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                </div>
                
                <div class="form-options">
                    <div class="remember-me">
                        <input type="checkbox" id="terms" required>
                        <label for="terms">I agree to the Terms & Conditions</label>
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-signin" style="flex: 1;">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                    <button type="button" class="btn btn-outline" id="switchToLogin" style="flex: 1;">
                        <i class="fas fa-sign-in-alt"></i> Back to Login
                    </button>
                </div>
            `;
            
            signupSwitch.innerHTML = '<p>Already have an account? <a href="#" id="switchToLoginLink">Sign in here</a></p>';
            
        //     // Add event listeners to new buttons
            document.getElementById('switchToLogin').addEventListener('click', switchToLogin);
            document.getElementById('switchToLoginLink').addEventListener('click', switchToLogin);
            
            // Add form submission
            const newForm = loginModal.querySelector('form');
            newForm.addEventListener('submit', handleSignup);
        }

        // function switchToLogin() {
            isSignupMode = false;
            modalTitle.textContent = 'Sign In to DevHub';
            loginForm.innerHTML = `
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required>
                </div>
                
                <div class="form-options">
                    <div class="remember-me">
                        <input type="checkbox" id="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a href="#" class="forgot-password">Forgot password?</a>
                </div>
                
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-signin" style="flex: 1;">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    <button type="button" class="btn btn-outline" id="switchToSignup" style="flex: 1;">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                </div>
            `;
            
            signupSwitch.innerHTML = '<p>Don\'t have an account? <a href="#" id="switchToSignupLink">Sign up here</a></p>';
            
            // Add event listeners
            document.getElementById('switchToSignup').addEventListener('click', switchToSignup);
            document.getElementById('switchToSignupLink').addEventListener('click', switchToSignup);
            
            // Add form submission
            const newForm = loginModal.querySelector('form');
            newForm.addEventListener('submit', handleLogin);
        

        // Form submission handlers
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate login process
            if (email && password) {
                alert(`Welcome back!, You'll be redirected to your dashboard.`);
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // In a real app, you would redirect to the admin page
                window.location.href = 'admin.html';
            }
        }

        function handleSignup(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (name && email && password) {
                alert(`Welcome to DevHub, ${name}! Your account has been created.`);
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';

                // In a real app, you would redirect to the admin page
                window.location.href = 'admin.html';
                
                // Switch back to login for demo purposes
                // setTimeout(() => {
                //     switchToLogin();
                // }, 500);
            }
        }

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = mobileMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Explore button functionality
        document.getElementById('exploreBtn').addEventListener('click', () => {
            window.scrollTo({
                top: document.getElementById('features').offsetTop - 80,
                behavior: 'smooth'
            });
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            loginForm.addEventListener('submit', handleLogin);
            switchToSignupBtn.addEventListener('click', switchToSignup);
            switchToSignupLink.addEventListener('click', switchToSignup);
            
            // Animate stats counter
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                }, 30);
            });
        });