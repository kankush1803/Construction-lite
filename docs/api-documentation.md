# Construction Monitor - REST & Realtime API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. System Health
### `GET /api/health`
Returns backend operational status and uptime.
- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-20T18:00:00.000Z",
    "uptime": 128.4
  }
  ```

---

## 2. Dashboard Endpoints
### `GET /api/dashboard/summary`
Returns high-level aggregate KPIs, top active projects, fleet summary, workforce allocation, safety metrics, and chart series.

---

## 3. Projects Endpoints
### `GET /api/projects`
Returns array of all construction developments.

### `GET /api/projects/:id`
Returns detailed project profile including associated machinery count and active personnel.

### `POST /api/projects`
Creates a new project. Validated with Zod.
- **Request Body:**
  ```json
  {
    "name": "Skyline Heights Tower B",
    "code": "PRJ-2026-005",
    "client": "Metro Urban Corp",
    "location": "Downtown Sector 5",
    "budget": 52000000,
    "start_date": "2026-11-01",
    "end_date": "2027-12-31"
  }
  ```

### `PATCH /api/projects/:id/progress`
Updates current progress percentage (0 - 100%).

---

## 4. Equipment Endpoints
### `GET /api/equipment`
List tracked equipment. Optional filter: `?projectId=1`.

### `GET /api/equipment/summary`
Returns aggregated count by status (Active, Idle, Maintenance, Offline), overall utilization percentage, and fleet average health score.

---

## 5. Workforce Endpoints
### `GET /api/manpower`
List registered on-site and off-site workers. Optional filter: `?projectId=1`.

### `GET /api/manpower/summary`
Returns attendance stats, breakdown across trade crafts, and safety certification percentage.

---

## 6. Safety & Alerts Endpoints
### `GET /api/safety/overview`
Returns site safety KPIs, incident-free days, and PPE compliance rate.

### `GET /api/alerts`
List incidents and sensor anomalies. Optional filters: `?status=Open&severity=Critical`.

### `PATCH /api/alerts/:id/acknowledge`
Marks an open alert as acknowledged.

---

## 7. Socket.IO Real-Time Events

| Event Name | Direction | Payload Description |
|---|---|---|
| `connection:ack` | Server -> Client | Connection verification and socket ID |
| `telemetry:reading`| Server -> Client | Real-time sensor reading (temperature, vibration, fuel, pressure) |
| `alert:new` | Server -> Client | New incident or AI/ML anomaly alert trigger |
| `dashboard:update` | Server -> Client | Periodic aggregate dashboard refresh |
