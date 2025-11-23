# CogniVerse Integration Guide

## Project Status: ✅ FULLY INTEGRATED

### What Was Done

#### 1. **Backend Models** ✅
- `User.js` - User profiles with enrollment tracking
- `Course.js` - Comprehensive course schema with curriculum
- `Job.js` - Job listings with application tracking
- `Resume.js` - Resume data for career services

#### 2. **Backend Routes** ✅
- `/api/auth` - Authentication (register, login, profile)
- `/api/courses` - Course catalog with filtering, search, pagination
- `/api/jobs` - Job board with filtering, apply, save functionality
- `/api/resume` - Resume management

#### 3. **Frontend Pages** ✅
- `pages/index.html` - Homepage with hero, featured courses, career preview
- `pages/courses.html` - Courses catalog with filters
- `pages/career.html` - Career services (resume builder, job board)
- `pages/features.html` - Platform features showcase

#### 4. **Frontend JavaScript** ✅
- `js/main.js` - Global API utilities, authentication, UI helpers
- `js/auth.js` - Login/register modals with API integration
- `js/courses.js` - Course listing, filtering, enrollment
- `js/jobs.js` - Job board, apply, save jobs
- `js/resume.js` - Resume builder with real-time preview
- `js/features.js` - Interactive feature demonstrations

#### 5. **Database Seeding** ✅
- Created `seeds/seedData.js` with sample courses and jobs
- Added npm script: `npm run seed`

---

## Features Implemented

### User Authentication
```
POST /api/auth/register - Create account
POST /api/auth/login - Sign in
GET /api/auth/me - Get current user (protected)
PUT /api/auth/profile - Update profile (protected)
```

### Courses
```
GET /api/courses - List all courses with filtering
GET /api/courses/featured - Get featured courses
GET /api/courses/:id - Get course details
POST /api/courses/:id/enroll - Enroll in course (protected)
GET /api/courses/user/enrolled - Get user's enrolled courses (protected)
```

**Filters Supported:**
- Category (multi-select)
- Level (beginner, intermediate, advanced)
- Price (free, paid)
- Search (title, description, instructor)
- Sort (newest, popular, price-low, price-high, rating)

### Jobs
```
GET /api/jobs - List jobs with filtering
GET /api/jobs/:id - Get job details
POST /api/jobs/:id/apply - Apply for job (protected)
POST /api/jobs/:id/save - Save job (protected)
GET /api/jobs/user/saved - Get saved jobs (protected)
```

**Filters Supported:**
- Category (multi-select)
- Job Type (Full-time, Part-time, Contract, Internship)
- Experience Level (Entry, Mid, Senior)
- Search (title, company, description, skills)
- Sort (newest, salary-high, salary-low)

### Resume
```
GET /api/resume - Get user's resume (protected)
POST /api/resume - Create/update resume (protected)
POST /api/resume/generate-pdf - Generate resume PDF (protected)
```

---

## Quick Start

### 1. Install Dependencies
```bash
cd cogniverse
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../..
```

### 2. Setup Environment Variables
Create `.env` file in `cogniverse/backend/`:
```
MONGODB_URI=mongodb://localhost:27017/cogniverse
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Start MongoDB
```bash
# Windows
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Seed Database
```bash
cd cogniverse/backend
npm run seed
```

### 5. Run Development Server
```bash
cd cogniverse
npm run dev
```

This will start:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## API Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success"
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

---

## Authentication

All protected endpoints require JWT token in headers:
```
Authorization: Bearer <token>
```

Token is automatically included by the frontend `API` utility class using `localStorage`.

---

## Frontend Integration Points

### API Utility (js/main.js)
```javascript
API.get(endpoint)
API.post(endpoint, data)
API.put(endpoint, data)
API.delete(endpoint)
```

### Auth Utility (js/main.js)
```javascript
Auth.isAuthenticated()
Auth.getToken()
Auth.getUser()
Auth.logout()
Auth.updateProfile(data)
```

### UI Utilities (js/main.js)
```javascript
UI.showNotification(message, type)
UI.formatPrice(price)
UI.truncateText(text, length)
```

---

## Database Schema

### Users
- Email/password authentication
- Role-based (student, instructor, admin)
- Profile: bio, skills, education, experience
- Enrolled courses with progress tracking

### Courses
- 7 categories: AI, Metaverse, Data Science, Web3, Cybersecurity, AR/VR, Quantum
- 3 levels: beginner, intermediate, advanced
- Curriculum with week-by-week breakdown
- Instructor information and rating system

### Jobs
- Multiple job types: Full-time, Part-time, Contract, Internship
- 5 categories matching course offerings
- Salary ranges with currency support
- Skills and requirements
- Application tracking

### Resumes
- Personal information
- Work experience with achievements
- Education with GPA
- Technical, soft, and language skills
- Projects and certifications

---

## Sample Data Included

### 8 Courses
- AI & Machine Learning Fundamentals
- Metaverse Development with Unity
- Data Science with Python
- Blockchain & Smart Contracts
- Cybersecurity Essentials
- AR/VR Development
- Quantum Computing Basics
- Advanced Python Programming

### 8 Jobs
- Senior Machine Learning Engineer
- Blockchain Developer
- Data Scientist
- Cybersecurity Analyst
- VR/AR Developer (Internship)
- Full Stack Developer
- AI Research Scientist
- IoT Security Engineer

---

## Frontend Pages

### Homepage (/)
- Hero section with CTA
- Featured courses carousel
- Career services preview
- Stats section
- AI chatbot
- Authentication modals

### Courses (/courses)
- Searchable course catalog
- Multi-filter sidebar
- Pagination
- Course cards with enrollment
- Featured categories section

### Career (/career)
- Resume builder with live preview
- Job board with search/filters
- Application tracking
- Saved jobs list
- Career stats

### Features (/features)
- Interactive feature demonstrations
- Benefits overview
- Pricing information
- Testimonials
- FAQ section

---

## Known Limitations & Future Enhancements

### Current Limitations
- PDF generation is stubbed (ready for integration with pdfkit or similar)
- File uploads need multer integration
- Email notifications stubbed in auth
- Payment processing not implemented

### Future Features
- Video course content delivery
- Live instructor sessions
- Coding exercises and projects
- Progress tracking and certificates
- Discussion forums
- Peer code reviews
- Job interview preparation tools
- AI career counseling chatbot
- Payment processing with Stripe/PayPal
- Email verification and notifications

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Try: `mongo --version` to verify installation

### Port Already in Use
- Change PORT in .env
- Or kill existing process on port 5000/3000

### npm install fails
- Delete node_modules and package-lock.json
- Run `npm cache clean --force`
- Try again: `npm install`

### API Returns 401
- Check localStorage token exists
- Verify JWT_SECRET in .env matches
- Re-login to get fresh token

---

## Project Structure

```
cogniverse/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Job.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── jobs.js
│   │   └── resumes.js
│   ├── middleware/
│   │   └── auths.js (JWT verification)
│   ├── seeds/
│   │   └── seedData.js
│   └── server.js
├── frontend/
│   ├── css/
│   │   ├── main.css
│   │   ├── homepage.css
│   │   ├── courses.css
│   │   ├── career.css
│   │   └── feature.css
│   ├── js/
│   │   ├── main.js (Core APIs)
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── jobs.js
│   │   ├── resume.js
│   │   ├── features.js
│   │   └── homepage.js
│   └── pages/
│       ├── index.html
│       ├── courses.html
│       ├── career.html
│       └── features.html
└── package.json
```

---

## Contact & Support

For issues or questions about the integration, check:
1. Backend console for API errors
2. Browser console (F12) for frontend errors
3. MongoDB logs for database issues
4. Review this guide for common issues

---

**Integration Complete!** 🎉
The CogniVerse platform is now fully integrated and ready for testing and deployment.
