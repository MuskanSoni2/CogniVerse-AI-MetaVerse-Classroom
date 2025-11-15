const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's resume
router.get('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update resume
router.post('/', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.userId });

    if (resume) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { user: req.userId },
        { $set: { ...req.body, lastUpdated: new Date() } },
        { new: true }
      );
    } else {
      // Create new resume
      resume = new Resume({
        user: req.userId,
        ...req.body
      });
      await resume.save();
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate PDF (placeholder - integrate with a PDF generation service)
router.post('/generate-pdf', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // In a real implementation, you would use a PDF generation service
    // For now, we'll return the resume data
    res.json({
      message: 'PDF generation would be implemented here',
      resume
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;