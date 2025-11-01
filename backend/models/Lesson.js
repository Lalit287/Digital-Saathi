const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Banking', 'UPI', 'E-Governance', 'Cybersecurity', 'Finance', 'Scam Prevention'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  infographicUrl: {
    type: String
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 5
  },
  pointsReward: {
    type: Number,
    default: 10
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  languages: {
    type: [String],
    default: ['en', 'hi']
  },
  translations: {
    type: Map,
    of: {
      title: String,
      description: String,
      content: String
    }
  }
}, {
  timestamps: true
});

lessonSchema.index({ category: 1, order: 1 });
lessonSchema.index({ isActive: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);

