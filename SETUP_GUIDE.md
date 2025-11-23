# 🛠️ CogniVerse Setup Guide - Troubleshooting & Solutions

## ✅ Current Status

- ✅ Node.js dependencies installed (root, backend, frontend)
- ✅ `.env` file created in backend folder
- ❌ MongoDB needs to be running

---

## 🚀 Getting MongoDB Running

### Option 1: MongoDB Community Server (Recommended)

**For Windows:**

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows MSI installer
   - Run the installer
   - Choose "Install MongoDB as a Service"
   - Complete installation

2. **Verify Installation**
   ```powershell
   mongod --version
   ```

3. **Start MongoDB Service**
   ```powershell
   # The service should auto-start, but if not:
   Get-Service MongoDB
   ```

---

### Option 2: MongoDB with Docker

**Prerequisites:**
- Docker Desktop running (may need admin)
- Docker daemon started

**Steps:**

1. **Start MongoDB Container**
   ```powershell
   docker run -d --name cogniverse-mongo -p 27017:27017 mongo:latest
   ```

2. **Verify Container is Running**
   ```powershell
   docker ps
   ```

3. **Stop Container (when needed)**
   ```powershell
   docker stop cogniverse-mongo
   ```

4. **Restart Container**
   ```powershell
   docker start cogniverse-mongo
   ```

---

### Option 3: MongoDB Atlas Cloud (Development)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a cluster (free tier available)

2. **Get Connection String**
   - Copy connection string from Atlas dashboard
   - Update `.env` file in backend:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cogniverse
   ```

3. **Update Connection String**
   ```powershell
   # Edit this file
   cd cogniverse\backend
   notepad .env
   # Paste your MongoDB Atlas URI
   ```

---

## ✅ Setup Checklist

- [ ] Dependencies installed (`npm run install-all` completed)
- [ ] `.env` file created with MongoDB URI
- [ ] MongoDB is running (local or cloud)
- [ ] Backend can connect to MongoDB

---

## 🔧 Fix Common Issues

### Issue 1: "npm run install-all" Failed

**Solution:**
```powershell
cd cogniverse

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

cd ../..
```

---

### Issue 2: MongoDB Not Found

**Solutions:**

A. Install from: https://www.mongodb.com/try/download/community

B. Or use MongoDB Atlas (cloud):
   - Free tier available
   - No installation needed
   - Update MONGODB_URI in .env

C. Or use Docker:
   ```powershell
   # Start Docker Desktop first
   docker run -d --name cogniverse-mongo -p 27017:27017 mongo:latest
   ```

---

### Issue 3: Port Already in Use

**MongoDB on 27017:**
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill process (replace PID)
taskkill /PID {PID} /F
```

**Backend on 5000:**
```powershell
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

**Frontend on 3000:**
```powershell
netstat -ano | findstr :3000
taskkill /PID {PID} /F
```

---

### Issue 4: Module Not Found

**Solution:**
```powershell
# Clear node_modules and reinstall
cd cogniverse
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run install-all
```

---

## 📋 Environment Setup

### Backend .env File

Located at: `cogniverse/backend/.env`

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cogniverse

# JWT Secret (change in production!)
JWT_SECRET=cogniverse_development_secret_key_change_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

---

## 🚀 Start Development Server

### Once MongoDB is Running:

```powershell
cd c:\Users\HP\Downloads\CogniVerse-AI-MetaVerse-Classroom-main\CogniVerse-AI-MetaVerse-Classroom-main\cogniverse

# Start both frontend and backend
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 🌱 Seed Database with Sample Data

### Once Server is Running:

```powershell
cd cogniverse\backend
npm run seed
```

**This will create:**
- 8 sample courses
- 8 sample jobs
- Ready to test!

---

## ✅ Verify Everything Works

### 1. Check Backend is Running
```
curl http://localhost:5000/api/courses
```

### 2. Check Frontend is Accessible
```
Open browser: http://localhost:3000
```

### 3. Test Course Endpoint
```powershell
curl "http://localhost:5000/api/courses?category=AI%20%26%20Machine%20Learning"
```

---

## 📊 Verification Commands

```powershell
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status (if installed locally)
mongod --version

# Check if MongoDB is running
# Try to connect
mongo localhost:27017

# List npm scripts
cd cogniverse
npm run
```

---

## 🔍 Troubleshooting Commands

```powershell
# Check all running processes
Get-Process | Where-Object {$_.ProcessName -match "node|mongo"}

# Check what's using specific port
netstat -ano | findstr :27017

# Check npm cache
npm cache verify

# List all npm packages
npm list --depth=0
```

---

## 📝 Next Steps

1. **Install MongoDB** (if not already done)
   - Option A: Download from mongodb.com
   - Option B: Use MongoDB Atlas (cloud)
   - Option C: Use Docker

2. **Verify .env file** 
   ```powershell
   cat cogniverse\backend\.env
   ```

3. **Start MongoDB**
   ```powershell
   mongod  # Local installation
   # OR
   docker run -d --name cogniverse-mongo -p 27017:27017 mongo:latest  # Docker
   ```

4. **Start Development Server**
   ```powershell
   cd cogniverse
   npm run dev
   ```

5. **Seed Database**
   ```powershell
   cd cogniverse\backend
   npm run seed
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

---

## 🆘 Still Having Issues?

### Check Logs

**Backend errors:**
```powershell
# Terminal running "npm run dev" shows errors
# Check console output for error messages
```

**Frontend errors:**
```
Open browser DevTools (F12)
Check Console tab for JavaScript errors
```

**Database errors:**
```powershell
# Verify MongoDB is running
curl http://localhost:27017/

# Should show basic MongoDB response
```

---

## 📚 Documentation Files

Inside `cogniverse/` folder:
- `README_INTEGRATION.md` - Overview
- `INTEGRATION_GUIDE.md` - Full technical docs
- `QUICK_START.md` - Commands reference
- `ARCHITECTURE.md` - System diagrams
- `INTEGRATION_CHECKLIST.md` - Features list

---

## ✅ Dependencies Installed

### Root (cogniverse/)
- concurrently ✅
- live-server ✅

### Backend (cogniverse/backend/)
- express ✅
- mongoose ✅
- bcryptjs ✅
- jsonwebtoken ✅
- cors ✅
- dotenv ✅
- multer ✅
- nodemailer ✅
- nodemon (dev) ✅

### Frontend (cogniverse/frontend/)
- (Static HTML/CSS/JS - no packages needed) ✅

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Install all deps | `npm run install-all` |
| Start dev server | `npm run dev` |
| Seed database | `cd backend && npm run seed` |
| Start backend only | `cd backend && npm run dev` |
| Start frontend only | `cd frontend && live-server --port=3000` |
| Check scripts | `npm run` |
| Clear cache | `npm cache clean --force` |

---

**Setup Complete!** Ready to start developing. 🚀
