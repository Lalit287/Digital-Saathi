const express = require('express');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, language } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const lessons = await Lesson.find(query).sort({ order: 1, createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single lesson
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('quiz');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete lesson
router.post('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already completed
    const alreadyCompleted = user.completedLessons.some(
      cl => cl.lessonId.toString() === req.params.id
    );

    if (!alreadyCompleted) {
      user.completedLessons.push({
        lessonId: lesson._id,
        score: req.body.score || 0
      });
      user.points += lesson.pointsReward;
      await user.save();
    }

    res.json({
      message: 'Lesson completed',
      pointsEarned: alreadyCompleted ? 0 : lesson.pointsReward,
      totalPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

