// Homepage specific functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        loadFeaturedCourses();
        loadFeaturesPreview();
    } catch (error) {
        console.error('Error loading homepage:', error);
    }
});

// Load featured courses
async function loadFeaturedCourses() {
    const featuredCoursesGrid = document.getElementById('featuredCoursesGrid');
    if (!featuredCoursesGrid) return;

    try {
        const data = await API.get('/courses/featured');
        displayCourses(data, featuredCoursesGrid);
    } catch (error) {
        console.error('Failed to load featured courses:', error);
        featuredCoursesGrid.innerHTML = '<p class="error-message">Failed to load featured courses. Please try again later.</p>';
    }
}

// Load features preview
async function loadFeaturesPreview() {
    const featuresGrid = document.getElementById('featuresGrid');
    if (!featuresGrid) return;

    // For now, we'll use static data. In a real app, this would come from an API.
    const features = [
        {
            icon: 'fas fa-robot',
            title: 'AI Learning Assistant',
            description: 'Get personalized guidance and answers to your questions 24/7 with our advanced AI chatbot.'
        },
        {
            icon: 'fas fa-vr-cardboard',
            title: 'Immersive Classrooms',
            description: 'Experience learning in hyper-realistic virtual environments with interactive 3D elements.'
        },
        {
            icon: 'fas fa-file-alt',
            title: 'Smart Resume Builder',
            description: 'Create professional resumes tailored to your career goals with AI-powered suggestions.'
        },
        {
            icon: 'fas fa-briefcase',
            title: 'Job Matching',
            description: 'Get personalized job recommendations based on your skills, interests, and career trajectory.'
        }
    ];

    displayFeatures(features, featuresGrid);
}

// Display courses in grid
function displayCourses(courses, container) {
    if (!courses || courses.length === 0) {
        container.innerHTML = '<p class="no-courses">No courses available at the moment.</p>';
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="course-card" data-course-id="${course._id}">
            <div class="course-image">
                <i class="${course.icon || 'fas fa-graduation-cap'}"></i>
                <div class="course-level ${course.level}">${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</div>
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3>${course.title}</h3>
                <p class="course-description">${UI.truncateText(course.description, 120)}</p>
                <div class="course-meta">
                    <div><i class="far fa-clock"></i> ${course.duration}</div>
                    <div><i class="far fa-user"></i> ${course.studentsEnrolled || 0} students</div>
                </div>
                <div class="course-footer">
                    <div class="course-price ${course.price === 0 ? 'free' : ''}">
                        ${UI.formatPrice(course.price)}
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="enrollInCourse('${course._id}')">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display features in grid
function displayFeatures(features, container) {
    container.innerHTML = features.map(feature => `
        <div class="feature-card" onclick="window.location.href='features.html'" style="cursor:pointer;">
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
}

// Enroll in course
async function enrollInCourse(courseId) {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please log in to enroll in courses', 'warning');
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    try {
        await API.post(`/courses/${courseId}/enroll`);
        UI.showNotification('Successfully enrolled in the course!', 'success');
        
        // Update UI if needed
        const enrollButton = document.querySelector(`[data-course-id="${courseId}"] .btn`);
        if (enrollButton) {
            enrollButton.textContent = 'Enrolled';
            enrollButton.disabled = true;
            enrollButton.classList.remove('btn-secondary');
            enrollButton.classList.add('btn-primary');
        }
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Explore courses button handler
function exploreCourses() {
    // Use the static page path so navigation works when served as static files
    window.location.href = 'courses.html';
}

// Take tour handler
function takeTour() {
    UI.showNotification('Virtual tour feature coming soon!', 'info');
}