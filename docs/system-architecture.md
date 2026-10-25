# Construction Monitor - System Architecture

## 1. High-Level Architecture Overview

Construction Monitor is a desktop application engineered for real-time tracking, telemetry analytics, and anomaly detection on construction sites.

```
┌─────────────────────────────────────────────────────────────┐
│                       Electron Shell                        │
│                                                             │
│  ┌─────────────────────────┐     ┌───────────────────────┐  │
│  │   Renderer Process      │     │     Main Process      │  │
│  │   (React + Vite)        │     │  (Node.js CommonJS)   │  │
│  │  - Recharts Dashboards  │◄───►│  - Native Window      │  │
│  │  - Context & Hooks      │ IPC │  - Preload & Security │  │
│  │  - Socket.IO Client     │     │  - IPC Channel Hub    │  │
│  └───────────┬─────────────┘     └───────────────────────┘  │
└──────────────┼──────────────────────────────────────────────┘
               │ HTTP / WebSockets
               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js / Express Backend                   │
│                                                             │
│  - REST API Routes & Controllers (Zod Validated)            │
│  - Services & Business Logic                                │
│  - Repository Data Access Layer                             │
│  - Socket.IO Realtime Telemetry Broadcast Server            │
│  - IoT Simulator & Telemetry Ingestion Engine               │
│  - AI/ML Anomaly Detection & Productivity Models            │
└──────────────────────────────┬──────────────────────────────┘
                               │ pg Connection Pool
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL Database Engine                  │
│                                                             │
│  - Projects, Equipment, Workers, Telemetry, Alerts Tables   │
│  - Indexed for sub-millisecond query performance            │
└─────────────────────────────────────────────────────────────┘
```

## 2. Component Roles & Communication

1. **Desktop Shell (Electron)**:
   - Configured securely with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.
   - Communication with renderer is strictly guarded through `preload.js` and `contextBridge`.
2. **Frontend UI (React + Vite)**:
   - Modern dark slate user interface with construction accent tokens.
   - Live socket streaming updates charts, telemetry feeds, and badges in real-time.
3. **Backend Service (Express + Socket.IO)**:
   - Modular architecture: Routes -> Controllers -> Services -> Repositories.
   - Robust offline fallback when PostgreSQL is not initialized locally.
4. **IoT Simulator & Processing Engine**:
   - Simulates telemetry across vibration, temperature, fuel, pressure, and worker vitals.
   - Evaluates real-time streams against rule-based and statistical anomaly detection models.
5. **AI/ML Layer (JavaScript)**:
   - Implements z-score statistical evaluation, Overall Equipment Effectiveness (OEE), and composite site safety risk scoring.
