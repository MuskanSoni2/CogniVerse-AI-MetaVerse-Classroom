// API base URL
const API_BASE = 'http://localhost:5000/api';

// Utility functions
class API {
    static async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Auth state management
class Auth {
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static async checkAuth() {
        if (!this.isAuthenticated()) return false;

        try {
            const user = await API.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    static async updateProfile(profileData) {
        try {
            const user = await API.put('/auth/profile', profileData);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            throw error;
        }
    }
}

// UI Utilities
class UI {
    static showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--card-bg);
                    border: 1px solid rgba(0, 247, 255, 0.3);
                    border-radius: 10px;
                    padding: 1rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 3000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                .notification-success {
                    border-color: #4ade80;
                }
                .notification-error {
                    border-color: #f87171;
                }
                .notification-warning {
                    border-color: #fbbf24;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--light);
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    static showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        return () => {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    static formatPrice(price) {
        if (price === 0) return 'Free';
        return `$${price.toFixed(2)}`;
    }

    static truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize floating elements
function initFloatingElements(containerId, count = 20) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        const size = Math.random() * 60 + 20;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.animationDelay = `${Math.random() * 10}s`;
        element.style.animationDuration = `${Math.random() * 20 + 15}s`;
        container.appendChild(element);
    }
}

// Initialize chatbot
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendMessage = document.getElementById('sendMessage');

    if (!chatbotToggle || !chatbotWindow) return;

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    if (sendMessage) {
        sendMessage.addEventListener('click', sendUserMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }

    function sendUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user-message');
            userMessageElement.textContent = message;
            chatbotMessages.appendChild(userMessageElement);
            
            // Clear input
            chatbotInput.value = '';
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simulate AI response
            setTimeout(() => {
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot-message');
                
                // Context-aware responses
                let response = "I'm an AI assistant. How can I help you with CogniVerse today?";
                
                if (message.toLowerCase().includes('course') || message.toLowerCase().includes('learn')) {
                    response = "We offer various courses in AI, Metaverse Development, Data Science and more. Check out our Courses page for details!";
                } else if (message.toLowerCase().includes('career') || message.toLowerCase().includes('job')) {
                    response = "Our career services include resume building, job matching, and counseling. Visit the Career page to explore opportunities.";
                } else if (message.toLowerCase().includes('feature') || message.toLowerCase().includes('what can you do')) {
                    response = "CogniVerse offers AI-powered learning, metaverse classrooms, career services, and more. Check out our Features page!";
                } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                    response = "We offer both free and paid courses. Some career services are free, while premium features may require subscription.";
                } else if (message.toLowerCase().includes('sign up') || message.toLowerCase().includes('register')) {
                    response = "You can register by clicking the Register button in the top navigation. It's quick and free to get started!";
                }
                
                botMessageElement.textContent = response;
                chatbotMessages.appendChild(botMessageElement);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }
}

// Initialize modals
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', () => {
            registerModal.classList.add('active');
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Update auth UI
function updateAuthUI() {
    const user = Auth.getUser();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user && authButtons) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${user.name}</span>
                <div class="dropdown">
                    <button class="btn btn-secondary">My Account</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="Auth.logout()">Logout</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    Auth.checkAuth().then(isAuthenticated => {
        if (isAuthenticated) {
            updateAuthUI();
        }
    });

    // Initialize components
    initChatbot();
    initModals();

    // Initialize floating elements for current page
    const currentPage = window.location.pathname;
    let floatingContainerId = 'floatingElements';
    
    if (currentPage.includes('features')) {
        floatingContainerId = 'featuresFloatingElements';
    } else if (currentPage.includes('courses')) {
        floatingContainerId = 'coursesFloatingElements';
    } else if (currentPage.includes('career')) {
        floatingContainerId = 'careerFloatingElements';
    }

    initFloatingElements(floatingContainerId);

    // Add active class to current page nav link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Export for use in other modules
window.API = API;
window.Auth = Auth;
window.UI = UI;