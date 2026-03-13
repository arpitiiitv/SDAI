require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const contactRoutes = require('./routes/contact');
const verifyRoutes = require('./routes/verify');
const certificatesRoutes = require('./routes/certificates');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/certificates', certificatesRoutes);

// Admin API (password-protected)
app.use('/api/admin', adminRoutes);

// Admin dashboard page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'SDAI API' });
});

// In production, serve frontend from parent/frontend folder
if (isProduction) {
  const frontendPath = path.join(__dirname, '..', 'frontend');
  app.use(express.static(frontendPath));
}

app.listen(PORT, () => {
  console.log(`SDAI backend running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  if (!isProduction) {
    console.log(`API: http://localhost:${PORT}/api/contact (POST), http://localhost:${PORT}/api/verify/:id (GET)`);
  }
});
