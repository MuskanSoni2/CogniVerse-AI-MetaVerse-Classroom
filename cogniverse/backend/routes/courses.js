const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses with filtering
router.get('/', async (req, res) => {
  try {
    const { category, level, price, search, page = 1, limit = 12 } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const courses = await Course.find({ featured: true }).limit(6);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrolled => enrolled.course.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({
      course: course._id,
      progress: 0,
      completed: false
    });

    course.studentsEnrolled += 1;
    
    await user.save();
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's enrolled courses
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('enrolledCourses.course');
    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;