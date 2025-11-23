# CogniVerse Quick Commands Reference

## Installation & Setup

```bash
# Install all dependencies
cd cogniverse
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ../..

# Or use the root script
npm run install-all
```

## Environment Setup

```bash
# Backend - Create .env file
cd cogniverse/backend
copy .env.example .env

# Then edit .env with your MongoDB URI and JWT secret
```

## Database Setup

```bash
# Start MongoDB (Windows - if installed)
mongod

# Or with Docker
docker run -d -p 27017:27017 --name cogniverse-mongo mongo

# Seed the database with sample data
cd cogniverse/backend
npm run seed
```

## Development

```bash
# Start both frontend and backend (from root)
cd cogniverse
npm run dev

# Start only backend (from backend folder)
npm run dev

# Start only frontend with live-server (from frontend folder)
live-server --port=3000
```

## Production

```bash
# Build frontend (if applicable)
npm run build

# Start backend (from backend folder)
npm start
```

## Useful Commands

```bash
# Check if MongoDB is running
mongo --version

# List all databases
mongo cogniverse
> show databases

# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest
```

## Testing Endpoints (Using cURL or Postman)

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get all courses
curl http://localhost:5000/api/courses

# Get courses with filters
curl "http://localhost:5000/api/courses?category=AI%20%26%20Machine%20Learning&level=beginner"

# Get all jobs
curl http://localhost:5000/api/jobs

# Get featured courses
curl http://localhost:5000/api/courses/featured

# Get specific course
curl http://localhost:5000/api/courses/{courseId}

# Get specific job
curl http://localhost:5000/api/jobs/{jobId}

# Enroll in course (requires auth token)
curl -X POST http://localhost:5000/api/courses/{courseId}/enroll \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# Apply for job (requires auth token)
curl -X POST http://localhost:5000/api/jobs/{jobId}/apply \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# Get current user (requires auth token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"

# Get user's resume (requires auth token)
curl http://localhost:5000/api/resume \
  -H "Authorization: Bearer {token}"

# Save resume (requires auth token)
curl -X POST http://localhost:5000/api/resume \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"personalInfo":{"name":"John","email":"john@example.com"}}'
```

## Filtering Examples

### Course Filters

```bash
# By category (single)
/api/courses?category=AI%20%26%20Machine%20Learning

# By multiple categories
/api/courses?category=AI%20%26%20Machine%20Learning,Data%20Science

# By level
/api/courses?level=beginner

# By price
/api/courses?price=free,paid

# By search
/api/courses?search=Python

# Combined filters
/api/courses?category=Data%20Science&level=intermediate&search=Python
```

### Job Filters

```bash
# By category
/api/jobs?category=AI%20%26%20Machine%20Learning

# By type
/api/jobs?type=Full-time

# By experience
/api/jobs?experience=Mid%20Level

# By multiple values
/api/jobs?type=Full-time,Part-time

# By search
/api/jobs?search=engineer

# Combined
/api/jobs?category=AI%20%26%20Machine%20Learning&experience=Mid%20Level&search=engineer
```

## Pagination Examples

```bash
# Page 1 with 12 items per page (default)
/api/courses

# Page 2
/api/courses?page=2

# Custom limit (50 items per page)
/api/courses?page=1&limit=50

# Get all with large limit
/api/jobs?limit=100
```

## Sorting Examples

```bash
# Newest first (default)
/api/courses?sort=newest

# Most popular
/api/courses?sort=popular

# Price low to high
/api/courses?sort=price-low

# Price high to low
/api/courses?sort=price-high

# Rating highest
/api/courses?sort=rating
```

## Troubleshooting Commands

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID {PID} /F

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"

# Reset database (clear all collections)
mongo cogniverse --eval "db.getCollectionNames().forEach(c => db[c].deleteMany({}))"

# View MongoDB logs
# Check MongoDB installation folder logs

# Clear browser cache
# Ctrl+Shift+Delete (Chrome)
# Cmd+Shift+Delete (Windows)
```

## Log Access

```bash
# Backend logs (console output)
# Check terminal running npm run dev

# Frontend logs
# Open browser DevTools (F12)
# Check Console tab

# MongoDB logs
# Check MongoDB process console
```

## Important File Locations

```
cogniverse/
├── INTEGRATION_GUIDE.md          ← Read this first
├── INTEGRATION_CHECKLIST.md      ← Full checklist
├── QUICK_START.md               ← This file
├── backend/
│   ├── .env.example             ← Copy to .env
│   ├── server.js                ← Main server file
│   ├── seeds/
│   │   └── seedData.js          ← Run: npm run seed
│   ├── models/
│   ├── routes/
│   └── middleware/
└── frontend/
    ├── pages/
    │   ├── index.html
    │   ├── courses.html
    │   ├── career.html
    │   └── features.html
    ├── js/
    │   ├── main.js              ← Core utilities
    │   ├── auth.js
    │   ├── courses.js
    │   ├── jobs.js
    │   └── resume.js
    └── css/
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :5000
kill -9 {PID}
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or check connection string in .env
MONGODB_URI=mongodb://localhost:27017/cogniverse
```

### Module Not Found
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Port 3000 Already in Use
```bash
# Use different port
live-server --port=8000
```

## Performance Testing

```bash
# Measure response time
time curl http://localhost:5000/api/courses

# Load test (requires Apache Bench)
ab -n 1000 -c 10 http://localhost:5000/api/courses
```

## Database Queries (In MongoDB Shell)

```javascript
// Connect to database
use cogniverse

// Count collections
db.users.countDocuments()
db.courses.countDocuments()
db.jobs.countDocuments()

// Find specific user
db.users.findOne({email: "john@example.com"})

// Find all courses in category
db.courses.find({category: "AI & Machine Learning"})

// Find jobs by company
db.jobs.find({company: "TechCorp AI"})

// Update user
db.users.updateOne({_id: ObjectId("...")}, {$set: {name: "New Name"}})

// Delete old jobs
db.jobs.deleteMany({expiresAt: {$lt: new Date()}})

// Get database statistics
db.stats()
```

## Useful Resources

- MongoDB Docs: https://docs.mongodb.com/
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/
- REST API Best Practices: https://restfulapi.net/

---

**Last Updated:** November 15, 2025
**Status:** ✅ Ready for Development
