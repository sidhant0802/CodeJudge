// backend/routes/savedcode.js
const express   = require('express');
const router    = express.Router();
const SavedCode = require('../models/SavedCode');
const jwt       = require('jsonwebtoken');

// ── Soft auth — does NOT block guests, just sets userhandle if logged in ──
function softAuth(req, res, next) {
  try {
    const tokenCookie = req.signedCookies?.token;

    if (!tokenCookie?.jwtToken) {
      // Not logged in — guest, continue without userhandle
      req.userhandle = null;
      return next();
    }

    const decoded = jwt.verify(tokenCookie.jwtToken, process.env.SECRET_KEY);

    // Get userhandle from cookie (since login JWT doesn't include it yet)
    req.userhandle = tokenCookie.userhandle || decoded.userhandle || null;
    next();

  } catch (err) {
    // Invalid/expired token — treat as guest
    req.userhandle = null;
    next();
  }
}

// ── POST /api/savedcode/save ──
router.post('/save', softAuth, async (req, res) => {
  try {
    const { PID, language, code } = req.body;
    const userhandle = req.userhandle;

    // Must be logged in to save to server
    if (!userhandle) {
      return res.status(401).json({ error: 'Login required to save to cloud' });
    }
    if (!PID || !language) {
      return res.status(400).json({ error: 'PID and language are required' });
    }

    await SavedCode.findOneAndUpdate(
      { userhandle, PID, language },
      { userhandle, PID, language, code, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true });

  } catch (err) {
    console.error('SavedCode save error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/savedcode/get/:PID/:language ──
router.get('/get/:PID/:language', softAuth, async (req, res) => {
  try {
    const { PID, language } = req.params;
    const userhandle = req.userhandle;

    // Must be logged in to fetch from server
    if (!userhandle) {
      return res.status(401).json({ error: 'Login required to fetch saved code' });
    }

    const saved = await SavedCode.findOne({ userhandle, PID, language });
    res.json({ code: saved?.code || null });

  } catch (err) {
    console.error('SavedCode get error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;