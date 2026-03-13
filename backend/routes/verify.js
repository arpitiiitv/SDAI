const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/verify/:certificateId — verify a certificate by ID
router.get('/:certificateId', (req, res) => {
  try {
    const certificateId = req.params.certificateId?.trim();
    if (!certificateId) {
      return res.status(400).json({
        valid: false,
        message: 'Certificate ID is required.',
      });
    }

    const row = db
      .prepare(
        `SELECT certificate_id, student_name, course, issued_at
         FROM certificates
         WHERE certificate_id = ?`
      )
      .get(certificateId);

    if (!row) {
      return res.json({
        valid: false,
        message: 'Certificate not found. Please check the ID and try again.',
      });
    }

    res.json({
      valid: true,
      certificate: {
        certificateId: row.certificate_id,
        studentName: row.student_name,
        course: row.course,
        issuedAt: row.issued_at,
      },
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({
      valid: false,
      message: 'Verification failed. Please try again later.',
    });
  }
});

module.exports = router;
