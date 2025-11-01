const express = require('express');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body; // Array of answer indices
    let correctCount = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const user = await User.findById(req.user._id);
    
    // Check if already completed
    const existingScore = user.quizScores.find(
      qs => qs.quizId.toString() === req.params.id
    );

    if (!existingScore) {
      user.quizScores.push({
        quizId: quiz._id,
        score
      });
      
      if (passed) {
        user.points += quiz.pointsReward;
      }
      await user.save();
    }

    res.json({
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      pointsEarned: passed && !existingScore ? quiz.pointsReward : 0,
      totalPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

