const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    portfolio: String,
    linkedin: String
  },
  summary: String,
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: Number,
    achievements: [String]
  }],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String]
  },
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiry: Date
  }],
  template: {
    type: String,
    default: 'modern'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);