const express = require('express');
const router = express.Router();
const pool = require('../db');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'arpit.tiwari@schoolofdataandai.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@schoolofdataandai.com';

// Send notification email via Resend HTTP API (fire-and-forget)
function sendNotification(data) {
  if (!RESEND_API_KEY) return;

  const typeLabel = { masterclass: 'Masterclass Registration', enrollment: 'Course Enrollment', enquiry: 'General Enquiry' };
  const subject = `New ${typeLabel[data.type] || 'Submission'} — ${data.name}`;

  const html = `
    <h2 style="color:#6c3ce0;">New ${typeLabel[data.type] || 'Submission'}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${data.name}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${data.phone}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${data.email}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">Type</td><td style="padding:6px 12px;">${data.type}</td></tr>
      ${data.courseTrack ? `<tr><td style="padding:6px 12px;font-weight:bold;">Track</td><td style="padding:6px 12px;">${data.courseTrack}</td></tr>` : ''}
      <tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${data.message || '—'}</td></tr>
    </table>
    <p style="color:#888;font-size:12px;margin-top:20px;">Sent by SDAI Backend</p>
  `;

  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'School of Data and AI <' + FROM_EMAIL + '>',
      to: [NOTIFY_EMAIL],
      subject,
      html,
    }),
  })
    .then(r => r.json())
    .then(d => { if (d.error) console.error('Resend error:', d.error); })
    .catch(err => console.error('Email notification error:', err.message));
}

// POST /api/contact — contact form, masterclass registration, or course enquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message = '', type = 'enquiry', courseTrack = null } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    const cleanData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      type: ['enquiry', 'masterclass', 'enrollment'].includes(type) ? type : 'enquiry',
      courseTrack: courseTrack ? String(courseTrack).trim() : null,
    };

    await pool.query(
      `INSERT INTO submissions (name, phone, email, message, type, course_track)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [cleanData.name, cleanData.phone, cleanData.email, cleanData.message, cleanData.type, cleanData.courseTrack]
    );

    // Send email notification (non-blocking)
    sendNotification(cleanData);

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
