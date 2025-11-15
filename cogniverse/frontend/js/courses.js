// Courses page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    initFilters();
    initSearch();
});

let currentPage = 1;
let currentFilters = {};
let allCourses = [];

// Load courses from API
async function loadCourses(page = 1, filters = {}) {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    try {
        // Build query string from filters
        const queryParams = new URLSearchParams({
            page: page,
            limit: 12,
            ...filters
        });

        const data = await API.get(`/courses?${queryParams}`);
        allCourses = data.courses;
        displayCourses(allCourses, coursesGrid);
        updatePagination(data.totalPages, page);
        
        currentPage = page;
        currentFilters = filters;
    } catch (error) {
        console.error('Failed to load courses:', error);
        coursesGrid.innerHTML = '<p class="error-message">Failed to load courses. Please try again later.</p>';
    }
}

// Initialize filters
function initFilters() {
    const filterForm = document.querySelector('.filters-sidebar');
    if (!filterForm) return;

    // Category filters
    const categoryCheckboxes = filterForm.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Level filters
    const levelCheckboxes = filterForm.querySelectorAll('input[name="level"]');
    levelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Price filters
    const priceCheckboxes = filterForm.querySelectorAll('input[name="price"]');
    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Duration filters
    const durationCheckboxes = filterForm.querySelectorAll('input[name="duration"]');
    durationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Apply filters button
    const applyFiltersBtn = filterForm.querySelector('.btn-primary');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const filters = {};

    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    if (selectedCategories.length > 0) {
        filters.category = selectedCategories.join(',');
    }

    // Get selected levels
    const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked'))
        .map(cb => cb.value);
    if (selectedLevels.length > 0) {
        filters.level = selectedLevels.join(',');
    }

    // Get price filters
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked'))
        .map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filters.price = selectedPrices.join(',');
    }

    // Get duration filters
    const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked'))
        .map(cb => cb.value);
    if (selectedDurations.length > 0) {
        filters.duration = selectedDurations.join(',');
    }

    loadCourses(1, filters);
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('courseSearch');
    const searchButton = document.querySelector('.search-container button');

    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    loadCourses(1, { ...currentFilters, search: searchTerm });
                } else {
                    loadCourses(1, currentFilters);
                }
            }, 500);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                loadCourses(1, { ...currentFilters, search: searchTerm });
            }
        });
    }
}

// Display courses in grid
function displayCourses(courses, container) {
    if (!courses || courses.length === 0) {
        container.innerHTML = `
            <div class="no-courses" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--light); margin-bottom: 1rem;">No courses found</h3>
                <p style="color: #a0a0e0;">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="course-card" data-course-id="${course._id}">
            <div class="course-image">
                <i class="${getCourseIcon(course.category)}"></i>
                <div class="course-level ${course.level}">${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</div>
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3>${course.title}</h3>
                <p class="course-description">${UI.truncateText(course.description, 120)}</p>
                <div class="course-meta">
                    <div><i class="far fa-clock"></i> ${course.duration}</div>
                    <div><i class="far fa-file-alt"></i> ${getLessonCount(course)} lessons</div>
                    <div><i class="far fa-user"></i> ${course.studentsEnrolled || 0}</div>
                </div>
                <div class="course-footer">
                    <div class="course-price ${course.price === 0 ? 'free' : ''}">
                        ${UI.formatPrice(course.price)}
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="enrollInCourse('${course._id}')">
                        ${isEnrolled(course._id) ? 'Enrolled' : 'Enroll Now'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update enrolled buttons
    updateEnrolledButtons();
}

// Get course icon based on category
function getCourseIcon(category) {
    const iconMap = {
        'AI & Machine Learning': 'fas fa-robot',
        'Metaverse Development': 'fas fa-vr-cardboard',
        'Data Science': 'fas fa-chart-line',
        'Web3 & Blockchain': 'fas fa-link',
        'Cybersecurity': 'fas fa-shield-alt',
        'AR/VR Development': 'fas fa-cube',
        'Quantum Computing': 'fas fa-atom'
    };
    return iconMap[category] || 'fas fa-graduation-cap';
}

// Get lesson count from curriculum
function getLessonCount(course) {
    if (!course.curriculum || !Array.isArray(course.curriculum)) return '0';
    return course.curriculum.reduce((total, week) => total + (week.topics?.length || 0), 0);
}

// Check if user is enrolled in course
function isEnrolled(courseId) {
    // This would typically check against user's enrolled courses from API
    // For now, we'll use a simple check
    return false;
}

// Update enrolled buttons based on user's enrollment
async function updateEnrolledButtons() {
    if (!Auth.isAuthenticated()) return;

    try {
        const enrolledCourses = await API.get('/courses/user/enrolled');
        enrolledCourses.forEach(enrollment => {
            const button = document.querySelector(`[data-course-id="${enrollment.course._id}"] .btn`);
            if (button) {
                button.textContent = enrollment.completed ? 'Completed' : 'Enrolled';
                button.disabled = true;
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
            }
        });
    } catch (error) {
        console.error('Failed to load enrolled courses:', error);
    }
}

// Update pagination
function updatePagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="loadCourses(${currentPage - 1}, currentFilters)"><i class="fas fa-chevron-left"></i></button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="loadCourses(${i}, currentFilters)">${i}</button>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="loadCourses(${currentPage + 1}, currentFilters)"><i class="fas fa-chevron-right"></i></button>`;
    }

    pagination.innerHTML = paginationHTML;
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
        
        // Update button
        const button = document.querySelector(`[data-course-id="${courseId}"] .btn`);
        if (button) {
            button.textContent = 'Enrolled';
            button.disabled = true;
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        }
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('courseSearch').value = '';
    loadCourses(1, {});
}

// Sort courses
function sortCourses(sortBy) {
    const filters = { ...currentFilters, sort: sortBy };
    loadCourses(1, filters);
}