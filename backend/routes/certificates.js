const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/certificates — add a new certificate (for admin/script use)
router.post('/', (req, res) => {
  try {
    const { certificateId, studentName, course, issuedAt } = req.body;

    if (!certificateId || !studentName || !course) {
      return res.status(400).json({
        success: false,
        message: 'certificateId, studentName, and course are required.',
      });
    }

    const stmt = db.prepare(
      `INSERT INTO certificates (certificate_id, student_name, course, issued_at)
       VALUES (?, ?, ?, ?)`
    );
    stmt.run(
      String(certificateId).trim(),
      String(studentName).trim(),
      String(course).trim(),
      issuedAt ? String(issuedAt).trim() : null
    );

    res.status(201).json({
      success: true,
      message: 'Certificate added.',
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        message: 'A certificate with this ID already exists.',
      });
    }
    console.error('Add certificate error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add certificate.',
    });
  }
});

module.exports = router;
