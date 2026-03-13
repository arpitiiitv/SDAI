# School of Data and AI (SDAI) — Website

Professional website for SDAI: AI and Data Science coaching institute, Kanpur, Uttar Pradesh, India.

**Goal:** Generate enrollments and registrations for the free weekly masterclass.

---

## Quick start

**Option A — With backend (recommended)**  
Contact form and certificate verification use the real API and database.

```bash
# Terminal 1: start backend
cd backend && npm install && npm start

# Terminal 2: start frontend
cd frontend && python3 -m http.server 8080
```

Open **http://localhost:8080**. The frontend will call the backend at **http://localhost:3000**.

**Option B — Frontend only**  
No form submission or certificate verification (placeholder behaviour).

```bash
cd frontend && python3 -m http.server 8080
```

Then open **http://localhost:8080**.

**Production (single server)**  
Set `NODE_ENV=production` and run only the backend; it serves the frontend and API on one port (e.g. 3000).

---

## Before you go live — 5 checks

| Check | What to do |
|-------|------------|
| **Logo** | Add your SDAI logo: put `logo.png` in `images/` and in each HTML file replace the logo `<span>` with `<img src="images/logo.png" alt="School of Data and AI">`. |
| **Course fees** | Confirm all 4 tracks show Phase 1 launch prices (see `index.html` and `courses.html`). |
| **Mobile view** | Open the site on your phone or use DevTools device mode; confirm layout and “Free Masterclass” button are clear. |
| **Contact form** | Submit a test enquiry. To actually receive submissions, connect the form to Formspree, Netlify Forms, or your backend (see below). |
| **Free Masterclass button** | Ensure the orange “Free Masterclass” button appears in the sticky header on every page (Home, Courses, About, Contact, Certificate). |

---

## Customise contact details

In **frontend/contact.html** update:

- **Phone:** `href="tel:+917905655394"` — +91 79056 55394
- **WhatsApp:** `href="https://wa.me/917905655394"`
- **Email:** `arpit.tiwari@sdai.com`
- **Address:** Replace “Kanpur, Uttar Pradesh, India” with your full address if needed.

---

## Contact form & certificate verification

The **backend** (`backend/`) handles form submissions and certificate verification:

- **Contact / masterclass form** → POST to `/api/contact`, stored in SQLite.
- **Certificate verification** → GET `/api/verify/:certificateId`; add certificates via POST `/api/certificates` or directly in the DB.

See **`backend/README.md`** for API details, how to add certificates, and production setup.

---

## Structure

```
sdai/
├── frontend/          # Website (HTML, CSS, JS, images)
│   ├── index.html, courses.html, about.html, contact.html, certificate.html
│   ├── css/, js/, images/
│   └── favicon.png
├── backend/           # Node.js + Express + SQLite API
│   ├── server.js
│   ├── db/            # Schema and SQLite DB (data/sdai.db)
│   ├── routes/       # contact, verify, certificates
│   └── README.md
└── README.md
```

---

## Brand

- **Name:** School of Data and AI (SDAI)
- **Tagline:** Learn Data. Master AI. Lead the World.
- **Colours:** Deep blue primary, white, teal and orange accents.
