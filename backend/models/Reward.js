const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  badgeIcon: {
    type: String
  },
  requirement: {
    type: {
      type: String,
      enum: ['points', 'lessons', 'quizzes', 'streak'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  pointsReward: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['Learning', 'Quiz Master', 'Community Helper', 'Streak Champion', 'Security Expert'],
    default: 'Learning'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', rewardSchema);

