// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');

    // Switch between login and register modals
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').classList.remove('active');
            document.getElementById('registerModal').classList.add('active');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerModal').classList.remove('active');
            document.getElementById('loginModal').classList.add('active');
        });
    }

    // Close modals
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            document.getElementById('loginModal').classList.remove('active');
        });
    }

    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', () => {
            document.getElementById('registerModal').classList.remove('active');
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const hideLoading = UI.showLoading(submitButton);
            
            const formData = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };

            try {
                const response = await API.post('/auth/login', formData);
                
                // Store token and user data
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                UI.showNotification('Login successful!', 'success');
                document.getElementById('loginModal').classList.remove('active');
                updateAuthUI();
                
                // Redirect or reload based on current page
                if (window.location.pathname === '/') {
                    window.location.reload();
                }
            } catch (error) {
                UI.showNotification(error.message, 'error');
            } finally {
                hideLoading();
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const hideLoading = UI.showLoading(submitButton);
            
            const formData = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                confirmPassword: document.getElementById('registerConfirmPassword').value
            };

            // Basic validation
            if (formData.password !== formData.confirmPassword) {
                UI.showNotification('Passwords do not match', 'error');
                hideLoading();
                return;
            }

            if (formData.password.length < 6) {
                UI.showNotification('Password must be at least 6 characters', 'error');
                hideLoading();
                return;
            }

            try {
                const response = await API.post('/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                
                // Store token and user data
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                UI.showNotification('Registration successful!', 'success');
                document.getElementById('registerModal').classList.remove('active');
                updateAuthUI();
                
                // Redirect or reload based on current page
                if (window.location.pathname === '/') {
                    window.location.reload();
                }
            } catch (error) {
                UI.showNotification(error.message, 'error');
            } finally {
                hideLoading();
            }
        });
    }
});

// Forgot password functionality
function handleForgotPassword() {
    const email = prompt('Please enter your email address:');
    if (email) {
        // In a real implementation, you would call an API endpoint
        UI.showNotification('Password reset instructions have been sent to your email.', 'info');
    }
}