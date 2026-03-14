const express = require('express');
const router = express.Router();
const pool = require('../db');

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
router.get('/submissions', async (req, res) => {
  try {
    const { type } = req.query;
    let result;
    if (type && ['masterclass', 'enrollment', 'enquiry'].includes(type)) {
      result = await pool.query(
        'SELECT id, name, phone, email, message, type, course_track, created_at FROM submissions WHERE type = $1 ORDER BY created_at DESC',
        [type]
      );
    } else {
      result = await pool.query(
        'SELECT id, name, phone, email, message, type, course_track, created_at FROM submissions ORDER BY created_at DESC'
      );
    }
    res.json({ submissions: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Admin submissions error:', err);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

// DELETE /api/admin/submissions/:id
router.delete('/submissions/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM submissions WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    res.json({ success: true, message: 'Submission deleted.' });
  } catch (err) {
    console.error('Admin delete submission error:', err);
    res.status(500).json({ error: 'Failed to delete submission.' });
  }
});

// GET /api/admin/certificates
router.get('/certificates', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, certificate_id, student_name, course, issued_at, created_at FROM certificates ORDER BY created_at DESC'
    );
    res.json({ certificates: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Admin certificates error:', err);
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// DELETE /api/admin/certificates/:id
router.delete('/certificates/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM certificates WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }
    res.json({ success: true, message: 'Certificate deleted.' });
  } catch (err) {
    console.error('Admin delete certificate error:', err);
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

// GET /api/admin/stats — quick summary
router.get('/stats', async (req, res) => {
  try {
    const totalSubmissions = (await pool.query('SELECT COUNT(*) as count FROM submissions')).rows[0].count;
    const masterclass = (await pool.query("SELECT COUNT(*) as count FROM submissions WHERE type = 'masterclass'")).rows[0].count;
    const enrollment = (await pool.query("SELECT COUNT(*) as count FROM submissions WHERE type = 'enrollment'")).rows[0].count;
    const enquiry = (await pool.query("SELECT COUNT(*) as count FROM submissions WHERE type = 'enquiry'")).rows[0].count;
    const totalCertificates = (await pool.query('SELECT COUNT(*) as count FROM certificates')).rows[0].count;
    res.json({ totalSubmissions: +totalSubmissions, masterclass: +masterclass, enrollment: +enrollment, enquiry: +enquiry, totalCertificates: +totalCertificates });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
