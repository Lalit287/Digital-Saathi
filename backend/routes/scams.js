const express = require('express');
const ScamAlert = require('../models/ScamAlert');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/auth');
const { fetchScamNews } = require('../services/newsService');

const router = express.Router();

// Get scam news from API (Google News style)
router.get('/news', async (req, res) => {
  try {
    const news = await fetchScamNews();
    res.json(news);
  } catch (error) {
    console.error('Error fetching scam news:', error);
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

// Get all scam alerts (verified only for public)
router.get('/', async (req, res) => {
  try {
    const { verified, category, location } = req.query;
    const query = {};

    if (req.user?.role !== 'admin') {
      query.verified = true; // Only show verified scams to non-admins
    } else if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    if (category) query.category = category;
    if (location?.state) query['location.state'] = location.state;

    const alerts = await ScamAlert.find(query)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Report new scam
router.post('/', authMiddleware, async (req, res) => {
  try {
    const scamData = {
      ...req.body,
      reportedBy: req.user._id
    };

    const scam = new ScamAlert(scamData);
    await scam.save();

    res.status(201).json(scam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify scam (admin only)
router.put('/:id/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const scam = await ScamAlert.findByIdAndUpdate(
      req.params.id,
      {
        verified: true,
        verifiedBy: req.user._id,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!scam) {
      return res.status(404).json({ message: 'Scam alert not found' });
    }

    res.json(scam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

