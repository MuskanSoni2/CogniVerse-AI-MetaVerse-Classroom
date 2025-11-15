const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all jobs with filtering
router.get('/', async (req, res) => {
  try {
    const { category, type, experience, search, page = 1, limit = 12 } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.user.toString() === req.userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applications.push({
      user: req.userId,
      status: 'pending'
    });

    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save job
router.post('/:id/save', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.savedJobs.includes(req.params.id)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(req.params.id);
    await user.save();

    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's saved jobs
router.get('/user/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;