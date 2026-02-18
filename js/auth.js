// Authentication System JavaScript

class Auth {
    static users = JSON.parse(localStorage.getItem('users') || '[]');
    static currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Initialize Login Page
    static initLoginPage() {
        this.setupLoginForm();
        this.setupPasswordToggle();
        this.setupSocialLogin();
        this.checkExistingSession();
    }

    // Initialize Register Page
    static initRegisterPage() {
        this.setupRegisterForm();
        this.setupPasswordToggle();
        this.setupPasswordConfirmation();
        this.setupSocialLogin();
        this.setupUsernameValidation();
    }

    // Setup Login Form
    static setupLoginForm() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(form);
            });
        }
    }

    // Setup Register Form
    static setupRegisterForm() {
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister(form);
            });
        }
    }

    // Handle Login
    static async handleLogin(form) {
        const email = form.email.value.trim();
        const password = form.password.value;
        const remember = form.remember.checked;

        // Clear previous errors
        this.clearErrors(form);

        // Validate
        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            this.showError('password', 'Please enter your password');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('#login-btn');
        this.setButtonLoading(submitBtn, true);

        // Simulate API call
        await this.delay(1500);

        // Check credentials
        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));

            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }

            this.showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            this.showError('email', 'Invalid email or password');
            this.showError('password', 'Invalid email or password');
        }

        this.setButtonLoading(submitBtn, false);
    }

    // Handle Register
    static async handleRegister(form) {
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.email.value.trim();
        const username = form.username.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const skillLevel = form.skillLevel.value;
        const newsletter = form.newsletter.checked;
        const terms = form.terms.checked;

        // Clear previous errors
        this.clearErrors(form);

        // Validate
        let hasError = false;

        if (!firstName) {
            this.showError('firstName', 'First name is required');
            hasError = true;
        }

        if (!lastName) {
            this.showError('lastName', 'Last name is required');
            hasError = true;
        }

        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            hasError = true;
        }

        if (!this.validateUsername(username)) {
            this.showError('username', 'Username must be 3-20 characters, letters and numbers only');
            hasError = true;
        }

        if (this.users.find(u => u.username === username)) {
            this.showError('username', 'Username is already taken');
            hasError = true;
        }

        if (this.users.find(u => u.email === email)) {
            this.showError('email', 'Email is already registered');
            hasError = true;
        }

        if (!password || password.length < 8) {
            this.showError('password', 'Password must be at least 8 characters long');
            hasError = true;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            hasError = true;
        }

        if (!skillLevel) {
            this.showError('skillLevel', 'Please select your skill level');
            hasError = true;
        }

        if (!terms) {
            this.showError('terms', 'You must agree to the terms and conditions');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        const submitBtn = form.querySelector('#register-btn');
        this.setButtonLoading(submitBtn, true);

        // Simulate API call
        await this.delay(2000);

        // Create user
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            username,
            password, // In real app, this would be hashed
            skillLevel,
            newsletter,
            createdAt: new Date().toISOString(),
            profile: {
                avatar: `https://picsum.photos/seed/${username}/100/100.jpg`,
                bio: '',
                location: '',
                website: ''
            },
            stats: {
                patternsDownloaded: 0,
                projectsCompleted: 0,
                favorites: 0,
                joinDate: new Date().toISOString()
            }
        };

        // Save user
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        this.showNotification('Account created successfully! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

        this.setButtonLoading(submitBtn, false);
    }

    // Setup Password Toggle
    static setupPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                const icon = toggle.querySelector('.eye-icon');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = '🙈';
                } else {
                    input.type = 'password';
                    icon.textContent = '👁️';
                }
            });
        });
    }

    // Setup Password Confirmation
    static setupPasswordConfirmation() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                if (confirmPassword.value && password.value !== confirmPassword.value) {
                    this.showError('confirmPassword', 'Passwords do not match');
                } else {
                    this.clearError('confirmPassword');
                }
            });
        }
    }

    // Setup Username Validation
    static setupUsernameValidation() {
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('input', () => {
                const username = usernameInput.value.trim();
                if (username && !this.validateUsername(username)) {
                    this.showError('username', 'Username must be 3-20 characters, letters and numbers only');
                } else if (username && this.users.find(u => u.username === username)) {
                    this.showError('username', 'Username is already taken');
                } else {
                    this.clearError('username');
                }
            });
        }
    }

    // Setup Social Login
    static setupSocialLogin() {
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.classList.contains('google') ? 'Google' : 'Facebook';
                this.showNotification(`${provider} login would be implemented here`, 'info');
            });
        });
    }

    // Check Existing Session
    static checkExistingSession() {
        if (this.currentUser) {
            window.location.href = 'dashboard.html';
        }
    }

    // Logout
    static logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        this.showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Validate Email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate Username
    static validateUsername(username) {
        const re = /^[a-zA-Z0-9]{3,20}$/;
        return re.test(username);
    }

    // Show Error
    static showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);

        if (field) {
            field.classList.add('error');
        }

        if (error) {
            error.textContent = message;
        }
    }

    // Clear Error
    static clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);

        if (field) {
            field.classList.remove('error');
        }

        if (error) {
            error.textContent = '';
        }
    }

    // Clear All Errors
    static clearErrors(form) {
        form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    // Set Button Loading
    static setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (loading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
        } else {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    // Show Notification
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Delay helper
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get Current User
    static getCurrentUser() {
        return this.currentUser;
    }

    // Is Logged In
    static isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update User Profile
    static updateUserProfile(updates) {
        if (this.currentUser) {
            Object.assign(this.currentUser, updates);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex] = this.currentUser;
                localStorage.setItem('users', JSON.stringify(this.users));
            }
        }
    }

    // Add to Favorites
    static addToFavorites(patternId) {
        if (this.currentUser) {
            if (!this.currentUser.favorites) {
                this.currentUser.favorites = [];
            }

            if (!this.currentUser.favorites.includes(patternId)) {
                this.currentUser.favorites.push(patternId);
                this.updateUserProfile(this.currentUser);
                this.showNotification('Added to favorites!', 'success');
            } else {
                this.showNotification('Already in favorites', 'info');
            }
        }
    }

    // Remove from Favorites
    static removeFromFavorites(patternId) {
        if (this.currentUser && this.currentUser.favorites) {
            const index = this.currentUser.favorites.indexOf(patternId);
            if (index !== -1) {
                this.currentUser.favorites.splice(index, 1);
                this.updateUserProfile(this.currentUser);
                this.showNotification('Removed from favorites', 'success');
            }
        }
    }

    // Track Pattern Download
    static trackPatternDownload(patternId) {
        if (this.currentUser) {
            if (!this.currentUser.downloads) {
                this.currentUser.downloads = [];
            }

            this.currentUser.downloads.push({
                patternId,
                timestamp: new Date().toISOString()
            });

            this.currentUser.stats.patternsDownloaded++;
            this.updateUserProfile(this.currentUser);
        }
    }
}

// Global logout handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
});
