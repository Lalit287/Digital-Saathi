const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  firebaseUID: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'volunteer', 'admin'],
    default: 'user'
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  badges: [{
    type: String
  }],
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],
  quizScores: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  language: {
    type: String,
    default: 'en'
  },
  location: {
    state: String,
    district: String,
    panchayat: String
  },
  isVolunteer: {
    type: Boolean,
    default: false
  },
  volunteerData: {
    helpCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

userSchema.index({ points: -1 });
userSchema.index({ location: 1 });

module.exports = mongoose.model('User', userSchema);

