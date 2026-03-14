-- SDAI backend: submissions (contact / masterclass / enrolment) and certificates

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'enquiry',
  course_track TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  certificate_id TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  issued_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(certificate_id);
