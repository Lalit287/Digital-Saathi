const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  helpCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    state: String,
    district: String,
    panchayat: String
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Offline'
  },
  specializations: [String],
  achievements: [String],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

volunteerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Volunteer', volunteerSchema);

