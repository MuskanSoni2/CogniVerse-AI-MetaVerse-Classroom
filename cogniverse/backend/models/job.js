const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  experience: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  skills: [String],
  category: {
    type: String,
    required: true,
    enum: ['AI & Machine Learning', 'Data Science', 'Software Development', 'Cybersecurity', 'Web3 & Blockchain']
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Job', jobSchema);