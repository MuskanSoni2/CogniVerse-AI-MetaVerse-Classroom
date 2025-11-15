-- Create database
CREATE DATABASE IF NOT EXISTS cogniverse;
USE cogniverse;

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
    bio TEXT,
    skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('AI & Machine Learning', 'Metaverse Development', 'Data Science', 'Web3 & Blockchain', 'Cybersecurity', 'AR/VR Development', 'Quantum Computing') NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    students_enrolled INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE enrollments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    course_id VARCHAR(255),
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Jobs table
CREATE TABLE jobs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    type ENUM('Full-time', 'Part-time', 'Contract', 'Internship') NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    experience ENUM('Entry Level', 'Mid Level', 'Senior Level') NOT NULL,
    description TEXT NOT NULL,
    requirements JSON,
    skills JSON,
    category ENUM('AI & Machine Learning', 'Data Science', 'Software Development', 'Cybersecurity', 'Web3 & Blockchain') NOT NULL,
    posted_by VARCHAR(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- Applications table
CREATE TABLE applications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    job_id VARCHAR(255),
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Resumes table
CREATE TABLE resumes (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,
    personal_info JSON,
    summary TEXT,
    experience JSON,
    education JSON,
    skills JSON,
    projects JSON,
    certifications JSON,
    template VARCHAR(100) DEFAULT 'modern',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);