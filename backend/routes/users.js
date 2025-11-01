const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { location, limit = 50 } = req.query;
    const query = {};
    
    if (location?.state) query['location.state'] = location.state;
    if (location?.district) query['location.district'] = location.district;

    const users = await User.find(query)
      .select('name points level badges location')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('completedLessons.lessonId', 'title category')
      .select('-password');

    const stats = {
      totalPoints: user.points,
      level: user.level,
      badgesCount: user.badges.length,
      lessonsCompleted: user.completedLessons.length,
      quizzesCompleted: user.quizScores.length,
      averageQuizScore: user.quizScores.length > 0
        ? Math.round(user.quizScores.reduce((sum, q) => sum + q.score, 0) / user.quizScores.length)
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

