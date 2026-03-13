const express = require('express');
const router = express.Router();
const db = require('../db');

// Auth middleware — checks Bearer token against ADMIN_PASSWORD
function requireAdmin(req, res, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server.' });
  }
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer ' + password) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing admin password.' });
  }
  next();
}

router.use(requireAdmin);

// GET /api/admin/submissions?type=masterclass|enrollment|enquiry
router.get('/submissions', (req, res) => {
  try {
    const { type } = req.query;
    let rows;
    if (type && ['masterclass', 'enrollment', 'enquiry'].includes(type)) {
      rows = db.prepare(
        'SELECT id, name, phone, email, message, type, course_track, created_at FROM submissions WHERE type = ? ORDER BY created_at DESC'
      ).all(type);
    } else {
      rows = db.prepare(
        'SELECT id, name, phone, email, message, type, course_track, created_at FROM submissions ORDER BY created_at DESC'
      ).all();
    }
    res.json({ submissions: rows, count: rows.length });
  } catch (err) {
    console.error('Admin submissions error:', err);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

// DELETE /api/admin/submissions/:id
router.delete('/submissions/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    res.json({ success: true, message: 'Submission deleted.' });
  } catch (err) {
    console.error('Admin delete submission error:', err);
    res.status(500).json({ error: 'Failed to delete submission.' });
  }
});

// GET /api/admin/certificates
router.get('/certificates', (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT id, certificate_id, student_name, course, issued_at, created_at FROM certificates ORDER BY created_at DESC'
    ).all();
    res.json({ certificates: rows, count: rows.length });
  } catch (err) {
    console.error('Admin certificates error:', err);
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// DELETE /api/admin/certificates/:id
router.delete('/certificates/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM certificates WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }
    res.json({ success: true, message: 'Certificate deleted.' });
  } catch (err) {
    console.error('Admin delete certificate error:', err);
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

// GET /api/admin/stats — quick summary
router.get('/stats', (req, res) => {
  try {
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
    const masterclass = db.prepare("SELECT COUNT(*) as count FROM submissions WHERE type = 'masterclass'").get().count;
    const enrollment = db.prepare("SELECT COUNT(*) as count FROM submissions WHERE type = 'enrollment'").get().count;
    const enquiry = db.prepare("SELECT COUNT(*) as count FROM submissions WHERE type = 'enquiry'").get().count;
    const totalCertificates = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;
    res.json({ totalSubmissions, masterclass, enrollment, enquiry, totalCertificates });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
