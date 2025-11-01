const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  questions: [questionSchema],
  pointsReward: {
    type: Number,
    default: 20
  },
  passingScore: {
    type: Number,
    default: 60 // percentage
  },
  timeLimit: {
    type: Number, // in seconds
    default: 300 // 5 minutes
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);

