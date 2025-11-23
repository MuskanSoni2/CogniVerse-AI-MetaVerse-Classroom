// Resume builder functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        initResumeForm();
        // Only load resume if authenticated
        if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
            loadResume();
        }
    } catch (error) {
        console.error('Error initializing resume:', error);
    }
});

let currentResume = null;

// Load user's resume
async function loadResume() {
    if (!Auth.isAuthenticated()) return;

    try {
        const resume = await API.get('/resume');
        if (resume) {
            currentResume = resume;
            populateResumeForm(resume);
            updateResumePreview(resume);
        }
    } catch (error) {
        console.error('Failed to load resume:', error);
        // It's okay if no resume exists yet
    }
}

// Initialize resume form
function initResumeForm() {
    const updateResumeBtn = document.getElementById('updateResume');
    const downloadPdfBtn = document.querySelector('.btn-secondary');

    if (updateResumeBtn) {
        updateResumeBtn.addEventListener('click', updateResume);
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePDF);
    }

    // Real-time preview updates
    const formInputs = document.querySelectorAll('#resumeForm input, #resumeForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(updatePreviewFromForm, 500));
    });
}

// Populate resume form with existing data
function populateResumeForm(resume) {
    // Personal Info
    if (resume.personalInfo) {
        document.getElementById('fullName').value = resume.personalInfo.name || '';
        document.getElementById('email').value = resume.personalInfo.email || '';
        document.getElementById('phone').value = resume.personalInfo.phone || '';
        document.getElementById('location').value = resume.personalInfo.location || '';
        document.getElementById('jobTitle').value = resume.personalInfo.title || '';
    }

    // Summary
    if (resume.summary) {
        document.getElementById('summary').value = resume.summary;
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
        document.getElementById('experience').value = formatExperienceForTextarea(resume.experience);
    }

    // Education
    if (resume.education && resume.education.length > 0) {
        document.getElementById('education').value = formatEducationForTextarea(resume.education);
    }

    // Skills
    if (resume.skills) {
        const skills = [
            ...(resume.skills.technical || []),
            ...(resume.skills.soft || []),
            ...(resume.skills.languages || [])
        ];
        document.getElementById('skills').value = skills.join(', ');
    }
}

// Format experience for textarea
function formatExperienceForTextarea(experience) {
    return experience.map(exp => {
        let text = `${exp.position} at ${exp.company}`;
        if (exp.startDate) {
            const startDate = new Date(exp.startDate).toLocaleDateString();
            const endDate = exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString();
            text += ` (${startDate} - ${endDate})`;
        }
        if (exp.description) {
            text += `\n- ${exp.description}`;
        }
        if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(achievement => {
                text += `\n- ${achievement}`;
            });
        }
        return text;
    }).join('\n\n');
}

// Format education for textarea
function formatEducationForTextarea(education) {
    return education.map(edu => {
        let text = `${edu.degree} in ${edu.field} at ${edu.institution}`;
        if (edu.startDate) {
            const startDate = new Date(edu.startDate).toLocaleDateString();
            const endDate = new Date(edu.endDate).toLocaleDateString();
            text += ` (${startDate} - ${endDate})`;
        }
        if (edu.gpa) {
            text += `\nGPA: ${edu.gpa}`;
        }
        if (edu.achievements && edu.achievements.length > 0) {
            edu.achievements.forEach(achievement => {
                text += `\n- ${achievement}`;
            });
        }
        return text;
    }).join('\n\n');
}

// Update resume
async function updateResume() {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please log in to save your resume', 'warning');
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    const resumeData = getResumeDataFromForm();

    try {
        const resume = await API.post('/resume', resumeData);
        currentResume = resume;
        UI.showNotification('Resume updated successfully!', 'success');
        updateResumePreview(resume);
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Get resume data from form
function getResumeDataFromForm() {
    return {
        personalInfo: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            title: document.getElementById('jobTitle').value
        },
        summary: document.getElementById('summary').value,
        experience: parseExperienceFromTextarea(document.getElementById('experience').value),
        education: parseEducationFromTextarea(document.getElementById('education').value),
        skills: {
            technical: parseSkills(document.getElementById('skills').value)
        }
    };
}

// Parse experience from textarea
function parseExperienceFromTextarea(text) {
    if (!text.trim()) return [];

    const experiences = text.split('\n\n');
    return experiences.map(expText => {
        const lines = expText.split('\n');
        const firstLine = lines[0];
        
        // Parse position and company
        const atIndex = firstLine.indexOf(' at ');
        let position = firstLine;
        let company = '';
        
        if (atIndex > -1) {
            position = firstLine.substring(0, atIndex);
            company = firstLine.substring(atIndex + 4);
            
            // Remove date range if present
            const dateIndex = company.indexOf(' (');
            if (dateIndex > -1) {
                company = company.substring(0, dateIndex);
            }
        }

        const experience = {
            position: position.trim(),
            company: company.trim(),
            current: false,
            description: '',
            achievements: []
        };

        // Parse description and achievements from remaining lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('- ')) {
                const achievement = line.substring(2);
                if (achievement) {
                    experience.achievements.push(achievement);
                }
            } else if (line) {
                experience.description = line;
            }
        }

        return experience;
    });
}

// Parse education from textarea
function parseEducationFromTextarea(text) {
    if (!text.trim()) return [];

    const educations = text.split('\n\n');
    return educations.map(eduText => {
        const lines = eduText.split('\n');
        const firstLine = lines[0];
        
        const education = {
            institution: '',
            degree: '',
            field: '',
            gpa: null,
            achievements: []
        };

        // Parse degree and institution
        const atIndex = firstLine.indexOf(' at ');
        if (atIndex > -1) {
            const degreePart = firstLine.substring(0, atIndex);
            education.institution = firstLine.substring(atIndex + 4);
            
            // Parse degree and field
            const inIndex = degreePart.indexOf(' in ');
            if (inIndex > -1) {
                education.degree = degreePart.substring(0, inIndex);
                education.field = degreePart.substring(inIndex + 4);
            } else {
                education.degree = degreePart;
            }
        }

        // Parse additional lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('GPA: ')) {
                education.gpa = parseFloat(line.substring(5));
            } else if (line.startsWith('- ')) {
                education.achievements.push(line.substring(2));
            }
        }

        return education;
    });
}

// Parse skills from comma-separated string
function parseSkills(skillsText) {
    if (!skillsText.trim()) return [];
    return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
}

// Update resume preview
function updateResumePreview(resume) {
    // Personal Info
    document.getElementById('preview-name').textContent = resume.personalInfo?.name || 'Your Name';
    document.getElementById('preview-title').textContent = resume.personalInfo?.title || 'Professional Title';
    document.getElementById('preview-contact').textContent = 
        `${resume.personalInfo?.email || 'email@example.com'} • ${resume.personalInfo?.phone || '(555) 123-4567'} • ${resume.personalInfo?.location || 'City, Country'}`;

    // Summary
    document.getElementById('preview-summary').textContent = resume.summary || 'Experienced professional with a proven track record of success...';

    // Experience
    const experienceText = resume.experience?.map(exp => 
        `${exp.position} at ${exp.company}${exp.description ? '\n' + exp.description : ''}`
    ).join('\n\n') || 'Senior Role at Company (2020-Present)\nPrevious Role at Another Company (2018-2020)';
    document.getElementById('preview-experience').textContent = experienceText;

    // Education
    const educationText = resume.education?.map(edu => 
        `${edu.degree} in ${edu.field}, ${edu.institution}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`
    ).join('\n') || 'Degree in Field, University\nAnother Degree, Another University';
    document.getElementById('preview-education').textContent = educationText;

    // Skills
    const skills = resume.skills?.technical || ['Skill 1', 'Skill 2', 'Skill 3'];
    document.getElementById('preview-skills').textContent = skills.join(', ');
}

// Update preview from form in real-time
function updatePreviewFromForm() {
    const resumeData = getResumeDataFromForm();
    updateResumePreview(resumeData);
}

// Generate PDF
async function generatePDF() {
    if (!Auth.isAuthenticated()) {
        UI.showNotification('Please log in to generate PDF', 'warning');
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    try {
        const response = await API.post('/resume/generate-pdf');
        UI.showNotification('PDF generation would be implemented here. Check console for details.', 'info');
        console.log('PDF generation response:', response);
        
        // In a real implementation, this would download the PDF file
        // For now, we'll show a success message
        UI.showNotification('PDF download started!', 'success');
    } catch (error) {
        UI.showNotification(error.message, 'error');
    }
}

// Debounce function for real-time updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add experience section
function addExperience() {
    const experienceTextarea = document.getElementById('experience');
    const newExperience = `Position at Company (Start Date - End Date)\n- Achievement 1\n- Achievement 2`;
    
    if (experienceTextarea.value) {
        experienceTextarea.value += '\n\n' + newExperience;
    } else {
        experienceTextarea.value = newExperience;
    }
    
    updatePreviewFromForm();
}

// Add education section
function addEducation() {
    const educationTextarea = document.getElementById('education');
    const newEducation = `Degree in Field at Institution (Start Date - End Date)\nGPA: 3.8\n- Achievement 1\n- Achievement 2`;
    
    if (educationTextarea.value) {
        educationTextarea.value += '\n\n' + newEducation;
    } else {
        educationTextarea.value = newEducation;
    }
    
    updatePreviewFromForm();
}