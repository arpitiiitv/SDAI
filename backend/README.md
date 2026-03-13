# SDAI Backend

Node.js + Express + SQLite API for the SDAI website: contact form, masterclass registration, and certificate verification.

## Setup

```bash
cd backend
npm install
```

## Run

```bash
npm start
```

Server runs at **http://localhost:3000**. Create a `.env` file (copy from `.env.example`) to set `PORT` or `DB_PATH` if needed.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact / masterclass / enquiry. Body: `{ name, phone, email, message?, type?, courseTrack? }`. `type`: `enquiry` \| `masterclass` \| `enrollment`. |
| GET | `/api/verify/:certificateId` | Verify a certificate. Returns `{ valid, certificate? }` or `{ valid: false, message }`. |
| POST | `/api/certificates` | Add a certificate. Body: `{ certificateId, studentName, course, issuedAt? }`. Use for admin/scripts. |
| GET | `/api/health` | Health check. |

## Database

- **SQLite** file at `data/sdai.db` (create the folder if it doesn’t exist).
- **Tables:** `submissions` (form entries), `certificates` (for verification).

### Add a certificate (for testing verification)

Using the API:

```bash
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{"certificateId":"SDAI-2025-001","studentName":"Test Student","course":"Track 1: AI for Everyone","issuedAt":"2025-03-01"}'
```

Or with Node (from project root):

```bash
cd backend && node -e "
const db = require('./db');
db.prepare(\"INSERT INTO certificates (certificate_id, student_name, course, issued_at) VALUES (?, ?, ?, ?)\").run('SDAI-2025-001', 'Test Student', 'Track 1: AI for Everyone', '2025-03-01');
console.log('Certificate added.');
"
```

## Development

- **Frontend** (static): run from `frontend/` on port 8080, e.g. `python3 -m http.server 8080`. It will call the API at `http://localhost:3000`.
- **Backend**: run `npm start` in `backend/`. CORS is enabled so the frontend on another port can call the API.

## Production

Set `NODE_ENV=production`. The server will also serve the `frontend/` folder; deploy one app and use a single port (e.g. 3000). No separate static server needed.
