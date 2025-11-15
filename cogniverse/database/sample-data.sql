-- Use the cogniverse database
USE cogniverse;

-- Insert sample users
INSERT INTO users (id, name, email, password, role, bio, skills, created_at) VALUES
('user1', 'John Smith', 'john.smith@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj89OFGVHFyW', 'student', 'Passionate AI enthusiast with background in computer science', '["Python", "Machine Learning", "TensorFlow", "Data Analysis"]', '2023-01-15 10:00:00'),
('user2', 'Sarah Johnson', 'sarah.johnson@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj89OFGVHFyW', 'student', 'Data scientist transitioning into AI engineering', '["Python", "R", "SQL", "Deep Learning", "Statistics"]', '2023-02-20 14:30:00'),
('user3', 'Mike Chen', 'mike.chen@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj89OFGVHFyW', 'instructor', 'Senior AI Engineer with 8+ years experience in computer vision', '["Python", "PyTorch", "Computer Vision", "OpenCV", "AWS"]', '2023-01-10 09:15:00'),
('user4', 'Emma Davis', 'emma.davis@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj89OFGVHFyW', 'instructor', 'Metaverse Developer and 3D Graphics Specialist', '["Unity", "C#", "3D Modeling", "VR Development", "Blender"]', '2023-03-05 11:45:00'),
('user5', 'Admin User', 'admin@cogniverse.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj89OFGVHFyW', 'admin', 'Platform Administrator', '["System Administration", "Database Management", "Security"]', '2023-01-01 08:00:00');

-- Insert sample courses
INSERT INTO courses (id, title, description, category, level, duration, price, instructor_name, instructor_bio, students_enrolled, rating, featured, created_at) VALUES
('course1', 'AI & Machine Learning Fundamentals', 'Learn the core concepts of artificial intelligence and machine learning with hands-on projects and real-world applications. This course covers everything from basic algorithms to neural networks.', 'AI & Machine Learning', 'beginner', '6 weeks', 49.99, 'Mike Chen', 'Senior AI Engineer with 8+ years experience in computer vision and deep learning', 1240, 4.8, TRUE, '2023-01-20 09:00:00'),
('course2', 'Advanced Deep Learning with PyTorch', 'Master advanced deep learning techniques including convolutional neural networks, recurrent neural networks, and transformer architectures using PyTorch.', 'AI & Machine Learning', 'advanced', '8 weeks', 79.99, 'Mike Chen', 'Senior AI Engineer with 8+ years experience in computer vision and deep learning', 856, 4.9, TRUE, '2023-02-15 10:30:00'),
('course3', 'Metaverse Development with Unity', 'Create immersive virtual worlds and experiences using Unity and VR/AR technologies. Learn 3D modeling, interaction design, and multiplayer functionality.', 'Metaverse Development', 'intermediate', '10 weeks', 69.99, 'Emma Davis', 'Metaverse Developer and 3D Graphics Specialist with 6 years of experience', 567, 4.7, TRUE, '2023-03-10 14:15:00'),
('course4', 'Data Science & Analytics Bootcamp', 'Complete data science course covering data analysis, visualization, statistical modeling, and machine learning for business intelligence.', 'Data Science', 'intermediate', '12 weeks', 59.99, 'Sarah Johnson', 'Lead Data Scientist with expertise in predictive analytics and ML deployment', 1890, 4.6, FALSE, '2023-02-01 11:20:00'),
('course5', 'Blockchain & Web3 Fundamentals', 'Understand blockchain technology, cryptocurrencies, smart contracts, and the foundations of Web3. Build your first DApp on Ethereum.', 'Web3 & Blockchain', 'beginner', '4 weeks', 0.00, 'John Smith', 'Blockchain Developer and Web3 Educator', 2100, 4.5, TRUE, '2023-03-20 16:45:00'),
('course6', 'Cybersecurity Essentials', 'Learn fundamental cybersecurity principles, threat detection, network security, and how to protect digital assets from modern cyber threats.', 'Cybersecurity', 'beginner', '5 weeks', 39.99, 'Mike Chen', 'Senior AI Engineer with 8+ years experience in computer vision and deep learning', 980, 4.4, FALSE, '2023-04-05 13:10:00'),
('course7', 'Advanced AR/VR Development', 'Build sophisticated augmented and virtual reality applications for various platforms including mobile, desktop, and standalone VR headsets.', 'AR/VR Development', 'advanced', '12 weeks', 89.99, 'Emma Davis', 'Metaverse Developer and 3D Graphics Specialist with 6 years of experience', 423, 4.8, TRUE, '2023-04-15 15:30:00'),
('course8', 'Quantum Computing Introduction', 'Explore the principles of quantum computing, quantum algorithms, and their potential applications in optimization and machine learning.', 'Quantum Computing', 'advanced', '7 weeks', 99.99, 'Admin User', 'Platform Administrator with research background in quantum computing', 156, 4.7, FALSE, '2023-05-01 10:00:00');

-- Insert sample enrollments
INSERT INTO enrollments (id, user_id, course_id, progress, completed, enrolled_at) VALUES
('enroll1', 'user1', 'course1', 75, FALSE, '2023-02-01 09:00:00'),
('enroll2', 'user1', 'course5', 100, TRUE, '2023-03-25 14:20:00'),
('enroll3', 'user2', 'course4', 60, FALSE, '2023-02-10 11:15:00'),
('enroll4', 'user2', 'course1', 100, TRUE, '2023-01-25 16:45:00'),
('enroll5', 'user1', 'course3', 25, FALSE, '2023-04-01 10:30:00');

-- Insert sample jobs
INSERT INTO jobs (id, title, company, type, location, salary_min, salary_max, experience, description, requirements, skills, category, posted_by, expires_at, created_at) VALUES
('job1', 'AI Engineer', 'NeuroTech Solutions', 'Full-time', 'San Francisco, CA', 120000, 150000, 'Mid Level', 'We''re looking for an AI Engineer to develop and deploy machine learning models for our computer vision products. You''ll work on cutting-edge AI solutions that transform how businesses operate.', '["Bachelor''s in Computer Science or related field", "3+ years experience in ML development", "Strong Python programming skills"]', '["Python", "TensorFlow", "Computer Vision", "Deep Learning"]', 'AI & Machine Learning', 'user3', '2023-12-31 23:59:59', '2023-06-01 09:00:00'),
('job2', 'Data Scientist', 'DataSphere Inc', 'Full-time', 'Remote', 100000, 130000, 'Mid Level', 'Join our data science team to analyze large datasets and build predictive models for business intelligence. Work with cross-functional teams to drive data-driven decisions.', '["Master''s in Data Science or related field", "2+ years experience in data analysis", "Proficiency in statistical modeling"]', '["Python", "R", "SQL", "Machine Learning", "Statistics"]', 'Data Science', 'user2', '2023-12-31 23:59:59', '2023-06-02 10:30:00'),
('job3', 'Machine Learning Intern', 'AI Innovations', 'Internship', 'New York, NY', 25, 30, 'Entry Level', 'Summer internship for students interested in applied machine learning and AI research. Work on real-world projects with mentorship from senior engineers.', '["Currently pursuing BS/MS in CS or related field", "Basic knowledge of ML concepts", "Python programming experience"]', '["Python", "PyTorch", "ML Algorithms"]', 'AI & Machine Learning', 'user3', '2023-08-31 23:59:59', '2023-06-03 14:15:00'),
('job4', 'Senior Software Engineer', 'TechNova', 'Full-time', 'Austin, TX', 130000, 160000, 'Senior Level', 'Lead development of scalable software systems with a focus on AI integration and cloud technologies. Architect and implement robust, maintainable code.', '["5+ years software development experience", "Expertise in cloud platforms", "Experience with microservices architecture"]', '["Java", "Python", "AWS", "Docker", "Kubernetes"]', 'Software Development', 'user4', '2023-12-31 23:59:59', '2023-06-04 11:45:00'),
('job5', 'Metaverse Developer', 'VirtualWorlds Inc', 'Full-time', 'Los Angeles, CA', 110000, 140000, 'Mid Level', 'Create immersive virtual and augmented reality experiences for education and training. Work with cutting-edge VR/AR technologies and 3D graphics.', '["3+ years experience in Unity/Unreal", "Strong 3D math skills", "Experience with VR/AR development"]', '["Unity", "C#", "3D Modeling", "VR Development"]', 'Metaverse Development', 'user4', '2023-12-31 23:59:59', '2023-06-05 16:20:00'),
('job6', 'Blockchain Developer', 'CryptoFuture Labs', 'Contract', 'Remote', 90000, 120000, 'Mid Level', 'Develop decentralized applications and smart contracts on blockchain platforms. Work on innovative Web3 projects with a talented team.', '["2+ years blockchain development", "Solidity programming experience", "Understanding of DeFi protocols"]', '["Solidity", "Web3.js", "Ethereum", "Smart Contracts"]', 'Web3 & Blockchain', 'user1', '2023-10-31 23:59:59', '2023-06-06 13:10:00');

-- Insert sample applications
INSERT INTO applications (id, user_id, job_id, status, applied_at) VALUES
('app1', 'user1', 'job1', 'pending', '2023-06-02 10:00:00'),
('app2', 'user1', 'job3', 'reviewed', '2023-06-04 14:30:00'),
('app3', 'user2', 'job2', 'pending', '2023-06-03 11:15:00'),
('app4', 'user2', 'job1', 'accepted', '2023-06-01 09:45:00');

-- Insert sample resumes
INSERT INTO resumes (id, user_id, personal_info, summary, experience, education, skills, projects, certifications, template, last_updated) VALUES
('resume1', 'user1', '{"name": "John Smith", "email": "john.smith@email.com", "phone": "(555) 123-4567", "location": "San Francisco, CA", "portfolio": "johnsmith.dev", "linkedin": "linkedin.com/in/johnsmith"}', 'Passionate AI Engineer with 2 years of experience in machine learning and deep learning. Strong background in computer vision and natural language processing. Proven track record of deploying AI solutions that improve business metrics.', '[{"company": "TechStart Inc", "position": "Junior AI Engineer", "startDate": "2022-01-15", "endDate": "2023-05-30", "current": false, "description": "Developed machine learning models for image classification and natural language processing tasks", "achievements": ["Improved model accuracy by 15% through hyperparameter optimization", "Reduced inference time by 40% by implementing model quantization", "Deployed 3 ML models to production serving 10,000+ daily requests"]}]', '[{"institution": "Stanford University", "degree": "M.S. Computer Science", "field": "Artificial Intelligence", "startDate": "2020-09-01", "endDate": "2022-05-30", "gpa": 3.8, "achievements": ["Graduated with honors", "Research in Computer Vision", "Teaching Assistant for ML Course"]}, {"institution": "UC Berkeley", "degree": "B.S. Computer Science", "field": "Computer Science", "startDate": "2016-09-01", "endDate": "2020-05-30", "gpa": 3.7, "achievements": ["Dean''s List", "Senior Project: AI Chatbot"]}]', '{"technical": ["Python", "TensorFlow", "PyTorch", "Computer Vision", "NLP", "AWS", "Docker", "Kubernetes"], "soft": ["Problem Solving", "Team Collaboration", "Communication", "Project Management"], "languages": ["English (Native)", "Spanish (Intermediate)"]}', '[{"name": "Image Classification System", "description": "Built a CNN model for classifying medical images with 95% accuracy", "technologies": ["Python", "TensorFlow", "OpenCV"], "link": "github.com/johnsmith/medical-ai"}, {"name": "Sentiment Analysis API", "description": "Developed a REST API for real-time sentiment analysis of customer reviews", "technologies": ["Python", "Flask", "NLTK", "Docker"], "link": "github.com/johnsmith/sentiment-api"}]', '[{"name": "TensorFlow Developer Certificate", "issuer": "Google", "date": "2022-03-15", "expiry": "2024-03-15"}, {"name": "AWS Machine Learning Specialty", "issuer": "Amazon", "date": "2022-08-20", "expiry": "2025-08-20"}]', 'modern', '2023-06-01 14:30:00'),

('resume2', 'user2', '{"name": "Sarah Johnson", "email": "sarah.johnson@email.com", "phone": "(555) 987-6543", "location": "New York, NY", "portfolio": "sarahjohnson.ai", "linkedin": "linkedin.com/in/sarahjohnson"}', 'Data Scientist with 3 years of experience in predictive modeling and business intelligence. Strong analytical skills with expertise in statistical analysis and machine learning. Passionate about turning data into actionable insights.', '[{"company": "DataCorp Solutions", "position": "Data Scientist", "startDate": "2020-07-01", "endDate": "2023-05-30", "current": true, "description": "Developed predictive models for customer behavior analysis and business forecasting", "achievements": ["Increased sales forecast accuracy by 25%", "Reduced customer churn by 15% through predictive modeling", "Built automated reporting dashboards used by executive team"]}]', '[{"institution": "MIT", "degree": "M.S. Data Science", "field": "Data Science", "startDate": "2018-09-01", "endDate": "2020-05-30", "gpa": 3.9, "achievements": ["Research Fellowship", "Published paper on ML in healthcare"]}, {"institution": "University of Chicago", "degree": "B.S. Statistics", "field": "Statistics", "startDate": "2014-09-01", "endDate": "2018-05-30", "gpa": 3.8, "achievements": ["Magna Cum Laude", "Statistics Department Award"]}]', '{"technical": ["Python", "R", "SQL", "Machine Learning", "Statistics", "Tableau", "Spark", "Hadoop"], "soft": ["Data Visualization", "Storytelling", "Critical Thinking", "Leadership"], "languages": ["English (Native)", "French (Intermediate)"]}', '[{"name": "Customer Segmentation Model", "description": "Developed clustering algorithm for customer segmentation improving marketing ROI by 30%", "technologies": ["Python", "Scikit-learn", "Pandas"], "link": "github.com/sarahj/segmentation"}, {"name": "Real-time Analytics Dashboard", "description": "Created interactive dashboard for real-time business metrics monitoring", "technologies": ["Tableau", "SQL", "Python"], "link": "github.com/sarahj/analytics-dash"}]', '[{"name": "Google Data Analytics Certificate", "issuer": "Google", "date": "2021-05-10", "expiry": "2024-05-10"}, {"name": "Tableau Desktop Specialist", "issuer": "Tableau", "date": "2021-11-15", "expiry": null}]', 'modern', '2023-06-02 16:45:00');

-- Update course students_enrolled counts based on enrollments
UPDATE courses c 
SET students_enrolled = (
    SELECT COUNT(*) 
    FROM enrollments e 
    WHERE e.course_id = c.id
);

-- Create some sample saved jobs
UPDATE users 
SET saved_jobs = JSON_ARRAY('job1', 'job3', 'job5') 
WHERE id = 'user1';

UPDATE users 
SET saved_jobs = JSON_ARRAY('job2', 'job4') 
WHERE id = 'user2';

-- Add some sample education and experience to user profiles
UPDATE users 
SET profile = JSON_OBJECT(
    'education', JSON_ARRAY(
        JSON_OBJECT('institution', 'Stanford University', 'degree', 'M.S. Computer Science', 'field', 'Artificial Intelligence', 'year', 2022),
        JSON_OBJECT('institution', 'UC Berkeley', 'degree', 'B.S. Computer Science', 'field', 'Computer Science', 'year', 2020)
    ),
    'experience', JSON_ARRAY(
        JSON_OBJECT('company', 'TechStart Inc', 'position', 'Junior AI Engineer', 'duration', '2022-2023', 'description', 'Developed ML models for computer vision applications')
    )
) 
WHERE id = 'user1';

UPDATE users 
SET profile = JSON_OBJECT(
    'education', JSON_ARRAY(
        JSON_OBJECT('institution', 'MIT', 'degree', 'M.S. Data Science', 'field', 'Data Science', 'year', 2020),
        JSON_OBJECT('institution', 'University of Chicago', 'degree', 'B.S. Statistics', 'field', 'Statistics', 'year', 2018)
    ),
    'experience', JSON_ARRAY(
        JSON_OBJECT('company', 'DataCorp Solutions', 'position', 'Data Scientist', 'duration', '2020-Present', 'description', 'Developed predictive models for business intelligence')
    )
) 
WHERE id = 'user2';