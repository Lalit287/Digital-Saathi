const express = require('express');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const ScamAlert = require('../models/ScamAlert');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Use auth and admin middleware for all routes
router.use(authMiddleware, adminMiddleware);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user by email (for testing/cleanup)
router.delete('/users/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const result = await User.deleteOne({ email });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List all user emails (helper endpoint)
router.get('/users/list', async (req, res) => {
  try {
    const users = await User.find().select('email name').limit(100);
    res.json(users.map(u => ({ email: u.email, name: u.name })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lesson
router.post('/lessons', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lesson
router.put('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lesson
router.delete('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create quiz
router.post('/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all scam alerts (including unverified)
router.get('/scams', async (req, res) => {
  try {
    const scams = await ScamAlert.find()
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(scams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalLessons: await Lesson.countDocuments(),
      totalQuizzes: await Quiz.countDocuments(),
      totalScams: await ScamAlert.countDocuments(),
      verifiedScams: await ScamAlert.countDocuments({ verified: true }),
      pendingScams: await ScamAlert.countDocuments({ verified: false })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
