const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cogniverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resume', require('./routes/resume'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.get('/features', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/features.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/courses.html'));
});

app.get('/career', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/career.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});