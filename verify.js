#!/usr/bin/env node

/**
 * CogniVerse Project Verification Script
 * Checks if all dependencies and configuration are properly set up
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✓ ${description}`, 'green');
      return true;
    } else {
      log(`✗ ${description} - File not found: ${filePath}`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ ${description} - Error checking file`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  try {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      log(`✓ ${description}`, 'green');
      return true;
    } else {
      log(`✗ ${description} - Directory not found: ${dirPath}`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ ${description} - Error checking directory`, 'red');
    return false;
  }
}

function checkCommand(command, description) {
  try {
    execSync(`${command}`, { stdio: 'pipe' });
    log(`✓ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} - Command failed`, 'red');
    return false;
  }
}

console.log('\n');
log('╔════════════════════════════════════════════════════════════╗', 'blue');
log('║        CogniVerse Project Verification Script             ║', 'blue');
log('╚════════════════════════════════════════════════════════════╝', 'blue');
console.log('');

let allChecks = true;

// Check Node and npm
log('📦 Checking Node.js and npm...', 'blue');
allChecks = checkCommand('node --version', 'Node.js installed') && allChecks;
allChecks = checkCommand('npm --version', 'npm installed') && allChecks;
console.log('');

// Check project structure
log('📁 Checking project structure...', 'blue');
allChecks = checkDirectory('./backend', 'Backend folder') && allChecks;
allChecks = checkDirectory('./frontend', 'Frontend folder') && allChecks;
allChecks = checkFile('./package.json', 'Root package.json') && allChecks;
allChecks = checkFile('./backend/package.json', 'Backend package.json') && allChecks;
console.log('');

// Check node_modules
log('📚 Checking dependencies...', 'blue');
allChecks = checkDirectory('./node_modules', 'Root dependencies installed') && allChecks;
allChecks = checkDirectory('./backend/node_modules', 'Backend dependencies installed') && allChecks;
checkDirectory('./frontend/node_modules', 'Frontend dependencies installed (optional)');
console.log('');

// Check environment configuration
log('⚙️  Checking environment configuration...', 'blue');
allChecks = checkFile('./backend/.env', 'Backend .env file') && allChecks;
allChecks = checkFile('./backend/.env.example', 'Backend .env.example') && allChecks;
console.log('');

// Check important model files
log('🗂️  Checking backend models...', 'blue');
allChecks = checkFile('./backend/models/User.js', 'User model') && allChecks;
allChecks = checkFile('./backend/models/Course.js', 'Course model') && allChecks;
allChecks = checkFile('./backend/models/Job.js', 'Job model') && allChecks;
allChecks = checkFile('./backend/models/Resume.js', 'Resume model') && allChecks;
console.log('');

// Check route files
log('🛣️  Checking backend routes...', 'blue');
allChecks = checkFile('./backend/routes/auth.js', 'Auth routes') && allChecks;
allChecks = checkFile('./backend/routes/courses.js', 'Course routes') && allChecks;
allChecks = checkFile('./backend/routes/jobs.js', 'Job routes') && allChecks;
allChecks = checkFile('./backend/routes/resumes.js', 'Resume routes') && allChecks;
console.log('');

// Check frontend pages
log('📄 Checking frontend pages...', 'blue');
allChecks = checkFile('./frontend/pages/index.html', 'Homepage') && allChecks;
allChecks = checkFile('./frontend/pages/courses.html', 'Courses page') && allChecks;
allChecks = checkFile('./frontend/pages/career.html', 'Career page') && allChecks;
allChecks = checkFile('./frontend/pages/features.html', 'Features page') && allChecks;
console.log('');

// Check frontend JavaScript
log('💻 Checking frontend scripts...', 'blue');
allChecks = checkFile('./frontend/js/main.js', 'Main script') && allChecks;
allChecks = checkFile('./frontend/js/auth.js', 'Auth script') && allChecks;
allChecks = checkFile('./frontend/js/courses.js', 'Courses script') && allChecks;
allChecks = checkFile('./frontend/js/jobs.js', 'Jobs script') && allChecks;
allChecks = checkFile('./frontend/js/resume.js', 'Resume script') && allChecks;
console.log('');

// Check documentation
log('📖 Checking documentation...', 'blue');
checkFile('./SETUP_GUIDE.md', 'Setup Guide');
checkFile('./README_INTEGRATION.md', 'Integration Guide');
checkFile('./INTEGRATION_GUIDE.md', 'Full Integration Guide');
checkFile('./QUICK_START.md', 'Quick Start Guide');
checkFile('./ARCHITECTURE.md', 'Architecture Documentation');
checkFile('./INTEGRATION_CHECKLIST.md', 'Integration Checklist');
console.log('');

// Check seed data
log('🌱 Checking seed data...', 'blue');
allChecks = checkFile('./backend/seeds/seedData.js', 'Seed script') && allChecks;
console.log('');

// Summary
console.log('');
log('╔════════════════════════════════════════════════════════════╗', 'blue');
if (allChecks) {
  log('║                  ✓ ALL CRITICAL CHECKS PASSED              ║', 'green');
  log('║                                                            ║', 'blue');
  log('║  Next steps:                                               ║', 'blue');
  log('║  1. Ensure MongoDB is running                              ║', 'blue');
  log('║  2. cd cogniverse\\backend && npm run seed                  ║', 'blue');
  log('║  3. cd .. && npm run dev                                   ║', 'blue');
} else {
  log('║          ⚠️  SOME CHECKS FAILED - SEE ABOVE                ║', 'yellow');
  log('║                                                            ║', 'blue');
  log('║  Please fix the issues above and try again                 ║', 'blue');
}
log('╚════════════════════════════════════════════════════════════╝', 'blue');
console.log('');

process.exit(allChecks ? 0 : 1);
