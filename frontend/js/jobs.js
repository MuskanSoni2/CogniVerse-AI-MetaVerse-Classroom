// Jobs functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        initJobFilters();
        initJobSearch();
        // Load jobs data
        if (document.getElementById('jobsGrid')) {
            loadJobs();
        }
    } catch (error) {
        console.error('Error initializing jobs:', error);
    }
});

let currentJobPage = 1;
let currentJobFilters = {};

// Load jobs from API
async function loadJobs(page = 1, filters = {}) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;

    try {
        // Build query string from filters
        const queryParams = new URLSearchParams({
            page: page,
            limit: 12,
            ...filters
        });

        const data = await API.get(`/jobs?${queryParams}`);
        displayJobs(data.jobs, jobsGrid);
        updateJobPagination(data.totalPages, page);
        
        currentJobPage = page;
        currentJobFilters = filters;
    } catch (error) {
        console.error('Failed to load jobs:', error);
        jobsGrid.innerHTML = '<p class="error-message">Failed to load jobs. Please try again later.</p>';
    }
}

// Initialize job filters
function initJobFilters() {
    const jobCategory = document.getElementById('jobCategory');
    const jobType = document.getElementById('jobType');
    const experienceLevel = document.getElementById('experienceLevel');

    if (jobCategory) {
        jobCategory.addEventListener('change', applyJobFilters);
    }

    if (jobType) {
        jobType.addEventListener('change', applyJobFilters);
    }

    if (experienceLevel) {
        experienceLevel.addEventListener('change', applyJobFilters);
    }

    // Search button
    const searchButton = document.querySelector('.job-filters .btn-primary');
    if (searchButton) {
        searchButton.addEventListener('click', applyJobFilters);
    }
}

// Apply job filters
function applyJobFilters() {
    const filters = {};

    const jobCategory = document.getElementById('jobCategory');
    const jobType = document.getElementById('jobType');
    const experienceLevel = document.getElementById('experienceLevel');
    const jobSearch = document.getElementById('jobSearch');

    if (jobCategory && jobCategory.value) {
        filters.category = jobCategory.value;
    }

    if (jobType && jobType.value) {
        filters.type = jobType.value;
    }

    if (experienceLevel && experienceLevel.value) {
        filters.experience = experienceLevel.value;
    }

    if (jobSearch && jobSearch.value.trim()) {
        filters.search = jobSearch.value.trim();
    }

    loadJobs(1, filters);
}

// Initialize job search
function initJobSearch() {
    const jobSearch = document.getElementById('jobSearch');
    if (!jobSearch) return;

    let searchTimeout;
    
    jobSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                loadJobs(1, { ...currentJobFilters, search: searchTerm });
            } else {
                loadJobs(1, currentJobFilters);
            }
        }, 500);
    });
}

// Display jobs in grid
function displayJobs(jobs, container) {
    if (!jobs || jobs.length === 0) {
        container.innerHTML = `
            <div class="no-jobs" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-briefcase" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--light); margin-bottom: 1rem;">No jobs found</h3>
                <p style="color: #a0a0e0;">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job._id}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-company">${job.company}</p>
                </div>
                <span class="job-type">${job.type}</span>
            </div>
            <div class="job-details">
                <div class="job-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${formatSalary(job.salary)}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-briefcase"></i>
                    <span>${job.experience}</span>
                </div>
            </div>
            <p class="job-description">${UI.truncateText(job.description, 200)}</p>
            <div class="job-skills">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="job-detail">
                <i class="far fa-clock"></i>
                <span>Posted ${formatTimeAgo(job.createdAt)}</span>
            </div>
            <div class="job-actions">
                <button class="btn btn-primary" onclick="applyForJob('${job._id}')">
                    ${hasApplied(job._id) ? 'Applied' : 'Apply Now'}
                </button>
                <button class="btn btn-secondary" onclick="saveJob('${job._id}')">
                    ${isJobSaved(job._id) ? 'Saved' : 'Save'}
                </button>
            </div>
        </div>
    `).join('');

    // Update applied and saved buttons
    updateJobButtons();
}

// Format salary display
function formatSalary(salary) {
    if (!salary) return 'Salary not specified';
    
    const { min, max, currency = 'USD' } = salary;
    
    if (min && max) {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
        return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
        return `Up to ${currency} ${max.toLocaleString()}`;
    }
    
    return 'Salary not specified';
}

// Format time ago
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Check if user has applied for job
function hasApplied(jobId) {
    // This would typically check against user's applications from API
    // For now, we'll use a simple check
    return false;
}

// Check if job is saved
function isJobSaved(jobId) {
    // This would typically check against user's saved jobs from API
    // For now, we'll use a simple check
    return false;
}

// Update job buttons based on user's actions
async function updateJobButtons() {
    if (!Auth.isAuthenticated()) return;

    try {
        // Update saved jobs
        const savedJobs = await API.get('/jobs/user/saved');
        savedJobs.forEach(job => {
            const saveButton = document.querySelector(`[data-job-id="${job._id}"] .btn-secondary`);
            if (saveButton) {
                saveButton.textContent = 'Saved';
                saveButton.disabled = true;
            }
        });

        // Note: Applied jobs would typically come from a different endpoint
    } catch (error) {
        console.error('Failed to load saved jobs:', error);
    }
}

// Update job pagination
function updateJobPagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="loadJobs(${currentPage - 1}, currentJobFilters)"><i class="fas fa-chevron-left"></i></button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="loadJobs(${i}, currentJobFilters)">${i}</button>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="loadJobs(${currentPage + 1}, currentJobFilters)"><i class="fas fa-chevron-right"></i></button>`;
    }

    pagination.innerHTML = paginationHTML;
}

// Apply for job
async function applyForJob(jobId) {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please log in to apply for jobs', 'warning');
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    try {
        await API.post(`/jobs/${jobId}/apply`);
        UI.showNotification('Application submitted successfully!', 'success');
        
        // Update button
        const button = document.querySelector(`[data-job-id="${jobId}"] .btn-primary`);
        if (button) {
            button.textContent = 'Applied';
            button.disabled = true;
        }
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Save job
async function saveJob(jobId) {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please log in to save jobs', 'warning');
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    try {
        await API.post(`/jobs/${jobId}/save`);
        UI.showNotification('Job saved successfully!', 'success');
        
        // Update button
        const button = document.querySelector(`[data-job-id="${jobId}"] .btn-secondary`);
        if (button) {
            button.textContent = 'Saved';
            button.disabled = true;
        }
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Clear job filters
function clearJobFilters() {
    document.getElementById('jobCategory').value = '';
    document.getElementById('jobType').value = '';
    document.getElementById('experienceLevel').value = '';
    document.getElementById('jobSearch').value = '';
    loadJobs(1, {});
}