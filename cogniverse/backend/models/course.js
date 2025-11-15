const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['AI & Machine Learning', 'Metaverse Development', 'Data Science', 'Web3 & Blockchain', 'Cybersecurity', 'AR/VR Development', 'Quantum Computing']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  instructor: {
    name: String,
    bio: String,
    expertise: [String]
  },
  curriculum: [{
    week: Number,
    title: String,
    topics: [String],
    resources: [{
      type: String,
      url: String
    }]
  }],
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  image: String,
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);