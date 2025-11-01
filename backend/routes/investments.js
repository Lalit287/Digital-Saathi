const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Calculate investment returns
router.post('/calculate', authMiddleware, async (req, res) => {
  try {
    const { type, principal, monthlyAmount, rate, years } = req.body;

    let results = {
      type,
      principal: principal || 0,
      monthlyAmount: monthlyAmount || 0,
      rate: rate || 0,
      years: years || 0,
      totalInvested: 0,
      totalReturns: 0,
      maturityAmount: 0,
      projections: []
    };

    if (type === 'FD') {
      // Fixed Deposit calculation
      const totalPrincipal = principal;
      const annualRate = rate / 100;
      const maturity = totalPrincipal * Math.pow(1 + annualRate, years);
      
      results.totalInvested = totalPrincipal;
      results.totalReturns = maturity - totalPrincipal;
      results.maturityAmount = maturity;

      // Monthly projections
      for (let i = 0; i <= years * 12; i += 12) {
        const amount = totalPrincipal * Math.pow(1 + annualRate, i / 12);
        results.projections.push({
          year: i / 12,
          amount: Math.round(amount)
        });
      }
    } else if (type === 'SIP') {
      // Systematic Investment Plan calculation
      const monthlyRate = rate / 100 / 12;
      const months = years * 12;
      const totalInvested = monthlyAmount * months;
      
      // SIP formula: Maturity = P * [((1 + r)^n - 1) / r] * (1 + r)
      const maturity = monthlyAmount * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      
      results.totalInvested = totalInvested;
      results.totalReturns = maturity - totalInvested;
      results.maturityAmount = maturity;

      // Monthly projections
      for (let i = 12; i <= months; i += 12) {
        const amount = monthlyAmount * 
          ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) * 
          (1 + monthlyRate);
        results.projections.push({
          year: i / 12,
          amount: Math.round(amount)
        });
      }
    } else if (type === 'PPF') {
      // Public Provident Fund (similar to SIP but with 15-year lock-in)
      const annualRate = rate / 100;
      const months = Math.min(years * 12, 180); // PPF max 15 years
      const monthlyRate = annualRate / 12;
      
      const totalInvested = monthlyAmount * months;
      const maturity = monthlyAmount * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      
      results.totalInvested = totalInvested;
      results.totalReturns = maturity - totalInvested;
      results.maturityAmount = maturity;

      for (let i = 12; i <= months; i += 12) {
        const amount = monthlyAmount * 
          ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) * 
          (1 + monthlyRate);
        results.projections.push({
          year: i / 12,
          amount: Math.round(amount)
        });
      }
    }

    // Round all values
    results.totalInvested = Math.round(results.totalInvested);
    results.totalReturns = Math.round(results.totalReturns);
    results.maturityAmount = Math.round(results.maturityAmount);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

