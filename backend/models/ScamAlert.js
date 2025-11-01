const mongoose = require('mongoose');

const scamAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Fake Loan App', 'Phishing', 'UPI Fraud', 'Investment Scam', 'Identity Theft', 'Other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  location: {
    state: String,
    district: String
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  imageUrl: String,
  source: {
    type: String,
    enum: ['User Report', 'Admin', 'Official Source'],
    default: 'User Report'
  },
  impact: {
    type: String
  },
  preventionTips: [String]
}, {
  timestamps: true
});

scamAlertSchema.index({ verified: 1, createdAt: -1 });
scamAlertSchema.index({ location: 1 });

module.exports = mongoose.model('ScamAlert', scamAlertSchema);

