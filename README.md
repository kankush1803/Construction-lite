# Construction Monitor

A desktop application for real-time monitoring of construction projects, equipment telematics, workforce attendance, site safety conditions, and AI/ML anomaly detection.

![Architecture](docs/system-architecture.md)

---

## 🛠️ Technology Stack

- **Desktop Shell:** Electron (with secure `contextIsolation` and IPC bridges)
- **Frontend:** React 18 with Vite
- **Styling:** Vanilla CSS design system (Dark slate theme with vibrant accents)
- **Visualizations:** Recharts (Area, Bar, Line, Pie charts)
- **Backend:** Node.js & Express (CommonJS)
- **Real-Time Streaming:** Socket.IO
- **Database:** PostgreSQL (with `pg` connection pool and graceful offline fallback)
- **Validation:** Zod schemas
- **AI / ML:** JavaScript statistical anomaly detection (z-scores, OEE, composite risk scoring)
- **Testing:** Vitest & Supertest

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL** *(optional for development)*: v12+ (The backend automatically falls back to an in-memory sample store if PostgreSQL is offline).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration values work immediately out of the box.

### 3. Initialize Database *(Optional)*
If you have PostgreSQL running locally:
```bash
# Create database
createdb -U postgres construction_monitor

# Run schema and seed
psql -U postgres -d construction_monitor -f database/schema.sql
psql -U postgres -d construction_monitor -f database/seed.sql
```

### 4. Run Development Environment
To launch the backend, Vite dev server, and Electron desktop window simultaneously:
```bash
npm run dev
```

Alternatively, you can run services independently:
- **Renderer only (Browser):** `npm run dev:renderer` (http://localhost:5173)
- **Backend only:** `npm run dev:backend` (http://localhost:5000/api/health)
- **Electron desktop app:** `npm run dev:electron`

---

## 🧪 Testing

Run all backend, AI/ML, and IoT simulator unit and integration tests:
```bash
npm test
```

---

## 📁 Project Structure

```text
construction-monitor/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── vite.config.js
│
├── electron/
│   ├── main.js
│   ├── preload.js
│   └── ipc/
│
├── src/
│   ├── renderer/          # React + Vite desktop frontend
│   │   ├── components/    # Layout, dashboard widgets, charts, common UI
│   │   ├── pages/         # Dashboard, Projects, Fleet, Workforce, Safety, Alerts
│   │   ├── hooks/         # Realtime Socket.IO and state hooks
│   │   ├── services/      # API communication layer
│   │   └── styles/        # CSS design system
│   │
│   ├── backend/           # Node.js + Express API
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database access (pg + fallback)
│   │   ├── routes/        # Express route definitions
│   │   ├── sockets/       # Socket.IO real-time hub
│   │   └── config/        # Environment and DB pool
│   │
│   ├── iot/               # IoT simulator & sensor processors
│   └── ai-ml/             # Statistical anomaly detection & analytics
│
├── database/              # Schema, seed data, and migrations
├── tests/                 # Vitest test suites
└── docs/                  # Architecture, database design, API docs
```

---

## 📄 License
MIT
