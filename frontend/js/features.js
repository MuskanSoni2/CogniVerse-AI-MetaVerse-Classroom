// Features page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initFeaturesNavigation();
    initInteractiveDemo();
});

// Initialize features navigation
function initFeaturesNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const featureSections = document.querySelectorAll('.feature-section');
    
    // Update active nav item on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        featureSections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

// Initialize interactive demo
function initInteractiveDemo() {
    const demoButtons = document.querySelectorAll('.demo-buttons .btn');
    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const demoBody = document.querySelector('.demo-body');
            if (demoBody) {
                demoBody.innerHTML = `
                    <div class="demo-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h3 style="color: var(--light); margin-bottom: 1rem;">AI Tutor Activated</h3>
                    <p class="demo-text">Hello! I'm your AI tutor. How can I help you learn today?</p>
                    <div class="demo-buttons">
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem;">Ask a Question</button>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="resetDemo()">Back</button>
                    </div>
                `;
                
                // Reattach event listeners for the new buttons
                document.querySelector('.demo-buttons .btn-primary').addEventListener('click', () => {
                    demoBody.innerHTML = `
                        <div class="demo-avatar">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3 style="color: var(--light); margin-bottom: 1rem;">Question Answered</h3>
                        <p class="demo-text">Based on your learning pattern, I recommend focusing on neural networks next. Would you like me to explain this concept?</p>
                        <div class="demo-buttons">
                            <button class="btn btn-primary" style="padding: 0.5rem 1rem;">Yes, Explain</button>
                            <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="resetDemo()">Back to Start</button>
                        </div>
                    `;
                });
            }
        });
    });
}

// Reset demo to initial state
function resetDemo() {
    const demoBody = document.querySelector('.demo-body');
    if (demoBody) {
        demoBody.innerHTML = `
            <div class="demo-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <h3 style="color: var(--light); margin-bottom: 1rem;">Welcome to CogniVerse</h3>
            <p class="demo-text">Experience learning in the metaverse with AI-powered guidance and immersive classrooms.</p>
            <div class="demo-buttons">
                <button class="btn btn-primary" style="padding: 0.5rem 1rem;">Enter Classroom</button>
                <button class="btn btn-secondary" style="padding: 0.5rem 1rem;">Meet AI Tutor</button>
            </div>
        `;
        
        // Reattach event listeners
        initInteractiveDemo();
    }
}

// Start free trial
function startFreeTrial() {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please register to start your free trial', 'info');
        document.getElementById('registerModal').classList.add('active');
        return;
    }
    
    UI.showNotification('Free trial activated! You now have access to all features for 14 days.', 'success');
}

// Watch demo
function watchDemo() {
    UI.showNotification('Opening demo video...', 'info');
    // In a real implementation, this would open a video modal or redirect to a demo page
}

// Book demo
function bookDemo() {
    UI.showNotification('Demo scheduling feature coming soon!', 'info');
}