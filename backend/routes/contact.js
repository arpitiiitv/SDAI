const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contact — contact form, masterclass registration, or course enquiry
router.post('/', (req, res) => {
  try {
    const { name, phone, email, message = '', type = 'enquiry', courseTrack = null } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    const stmt = db.prepare(
      `INSERT INTO submissions (name, phone, email, message, type, course_track)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      String(name).trim(),
      String(phone).trim(),
      String(email).trim(),
      String(message).trim(),
      ['enquiry', 'masterclass', 'enrollment'].includes(type) ? type : 'enquiry',
      courseTrack ? String(courseTrack).trim() : null
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! We have received your submission and will get back to you soon.',
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.',
    });
  }
});

module.exports = router;
