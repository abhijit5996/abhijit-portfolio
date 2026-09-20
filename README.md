# Abhijit Das — Developer Portfolio & CMS

A high-end personal developer portfolio and content management system for **Abhijit Das**, built with a modern React frontend and a dedicated, self-hosted Express.js + Node.js + MySQL backend architecture.

---

## 🌟 Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    React 19 + Vite                      │
│            TanStack Router / Tailwind CSS v4            │
└───────────────────────────┬─────────────────────────────┘
                            │ REST API Requests
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Express.js + Node.js                   │
│              TypeScript / JWT Auth / Multer             │
└───────────────────────────┬─────────────────────────────┘
                            │ Connection Pool (mysql2)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL 8.0 Database                   │
│      Users, Projects, Contact, Resumes, Analytics       │
└─────────────────────────────────────────────────────────┘
```

### Key Highlights
* **Fully Independent & Self-Hosted**: Zero third-party backend-as-a-service dependencies.
* **Express.js REST API**: Modular routes, controllers, services, and middleware.
* **MySQL Primary Database**: Relational schema with indexed tables, foreign keys, and JSON support.
* **JWT & bcrypt Auth**: Secure password hashing and token-based admin session handling.
* **Local Asset Storage**: Multer disk storage for project previews and resume PDF versioning.
* **Resend Email Relay**: Contact submission email notifications with graceful DB fallback.
* **First-Party Analytics**: Integrated event logger for page views, project clicks, and resume downloads.

---

## 📁 Repository Structure

```text
engineering-workspace/
├── server/                    # Express.js + Node.js + MySQL Backend
│   ├── src/
│   │   ├── config/            # DB connection pool & environment variables
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── middleware/        # JWT auth, Multer upload & rate limiters
│   │   ├── models/            # SQL DDL schemas & seed data
│   │   ├── routes/            # Express REST endpoint declarations
│   │   ├── services/          # Database queries & business logic
│   │   ├── app.ts             # Express application setup
│   │   └── index.ts           # Server entry point
│   ├── uploads/               # Static local storage for assets & resumes
│   ├── .env.example           # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── src/                       # React 19 Frontend
│   ├── components/            # UI components (Hero, Projects, Contact, etc.)
│   ├── data/                  # Static portfolio data fallbacks
│   ├── lib/
│   │   └── api/               # API clients calling Express REST endpoints
│   ├── routes/                # TanStack Router page components & Admin CMS
│   └── start.ts               # Frontend router setup
│
├── public/                    # Static public assets (favicon, images)
├── package.json               # Root frontend package configuration
├── .env.example               # Frontend environment template
└── README.md
```

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Configure MySQL connection in server/.env:
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_DATABASE=portfolio_db
# MYSQL_USER=root
# MYSQL_PASSWORD=yourpassword
# JWT_SECRET=your_jwt_secret_key

# Start backend server
npm run dev
```

The Express API server will start on `http://localhost:5000`.

### 2. Frontend Setup

```bash
# In workspace root (engineering-workspace)
npm install

# Copy environment template
cp .env.example .env

# Configure API URL in .env:
# VITE_API_URL=http://localhost:5000/api

# Start frontend dev server
npm run dev
```

---

## 🔑 Default Admin Credentials

* **Email**: `admin@example.com`
* **Password**: `admin123`

---

## 🛠️ REST API Endpoints

### Auth (`/api/auth`)
* `POST /api/auth/login` — Admin login
* `GET /api/auth/verify` — Verify JWT bearer token

### Projects (`/api/projects`)
* `GET /api/projects` — Fetch published portfolio projects
* `GET /api/projects/slug/:slug` — Fetch project details by slug
* `GET /api/projects/admin/all` — Fetch all projects (Admin)
* `POST /api/projects/admin` — Create project (Admin)
* `PUT /api/projects/admin/:id` — Update project (Admin)
* `DELETE /api/projects/admin/:id` — Delete project (Admin)
* `POST /api/projects/admin/upload-image` — Upload project image asset (Admin)

### Contact (`/api/contact`)
* `POST /api/contact` — Submit contact message
* `GET /api/contact/admin` — Fetch contact messages (Admin)
* `PATCH /api/contact/admin/:id/status` — Update message status (Admin)
* `DELETE /api/contact/admin/:id` — Delete contact message (Admin)

### Resume (`/api/resume`)
* `GET /api/resume/active` — Fetch active resume PDF URL
* `GET /api/resume/admin` — Fetch resume versions (Admin)
* `POST /api/resume/admin/upload` — Upload resume PDF (Admin)
* `PATCH /api/resume/admin/:id/active` — Set active resume (Admin)
* `DELETE /api/resume/admin/:id` — Delete resume version (Admin)

### Analytics (`/api/analytics`)
* `POST /api/analytics/event` — Log user interaction event
* `GET /api/analytics/admin` — Fetch analytics metrics & logs (Admin)

---

## 🔒 Verification & Build Commands

```bash
# Backend TypeScript Check
cd server && npx tsc --noEmit

# Frontend TypeScript Check
npx tsc --noEmit

# Production Frontend Build
npm run build
```

---

## 📜 License

MIT © Abhijit Das
