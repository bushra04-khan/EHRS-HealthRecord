const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const session = authService.login(email, password);
    res.json({
      success: true,
      message: 'Authentication successful',
      ...session
    });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// GET /api/auth/demo-accounts
router.get('/demo-accounts', (req, res) => {
  try {
    const accounts = authService.getDemoAccounts();
    res.json({ success: true, count: accounts.length, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
