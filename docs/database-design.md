# Construction Monitor - Database Design

## 1. Relational Entity Overview

The relational PostgreSQL database structure maintains referential integrity across projects, machinery assets, personnel, live sensor packets, and safety alerts.

### Entity Relationship Model

- **projects** (1) ───< **equipment** (N)
- **projects** (1) ───< **workers** (N)
- **projects** (1) ───< **alerts** (N)
- **equipment** (1) ───< **telemetry** (N)
- **equipment** (1) ───< **alerts** (N)

---

## 2. Table Specifications

### `projects`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique project identifier |
| `name` | VARCHAR(255) | NOT NULL | Project title |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Project reference code (e.g., PRJ-2026-001) |
| `client` | VARCHAR(255) | NOT NULL | Client organization |
| `location` | VARCHAR(255) | NOT NULL | Site geographical location |
| `budget` | NUMERIC(14, 2)| NOT NULL | Total allocated financial budget |
| `spent` | NUMERIC(14, 2)| DEFAULT 0.00 | Current incurred expenditure |
| `start_date`| DATE | NOT NULL | Project kick-off date |
| `end_date` | DATE | NOT NULL | Target completion date |
| `progress` | NUMERIC(5, 2) | DEFAULT 0.00 | Completion percentage (0 - 100%) |
| `status` | VARCHAR(50) | DEFAULT 'In Progress' | 'Planning', 'In Progress', 'Completed' |

### `equipment`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique machinery asset ID |
| `project_id`| INTEGER | REFERENCES projects(id) | Associated project |
| `name` | VARCHAR(255) | NOT NULL | Asset name (e.g., CAT 336 Excavator) |
| `type` | VARCHAR(100) | NOT NULL | Category (Excavator, Crane, etc.) |
| `serial_number` | VARCHAR(100) | UNIQUE, NOT NULL | Manufacturer identifier |
| `status` | VARCHAR(50) | DEFAULT 'Active' | 'Active', 'Idle', 'Maintenance', 'Offline' |
| `health_score` | NUMERIC(5, 2)| DEFAULT 100.00 | Calculated asset health score |
| `fuel_level` | NUMERIC(5, 2)| DEFAULT 100.00 | Tank fuel level percentage |
| `hours_operated` | NUMERIC(10, 2) | DEFAULT 0.00 | Engine operating meter hours |

### `workers`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Worker badge record ID |
| `project_id`| INTEGER | REFERENCES projects(id) | Site assignment |
| `full_name`| VARCHAR(255) | NOT NULL | Worker legal name |
| `role` | VARCHAR(100) | NOT NULL | Position title |
| `trade` | VARCHAR(100) | NOT NULL | Trade skill (Civil, Electrical, etc.) |
| `shift` | VARCHAR(50) | DEFAULT 'Day' | Current shift |
| `status` | VARCHAR(50) | DEFAULT 'On Site' | 'On Site', 'On Break', 'Off Site' |
| `safety_certified` | BOOLEAN | DEFAULT TRUE | Compliance pass status |

### `telemetry`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Telemetry log event ID |
| `equipment_id` | INTEGER | REFERENCES equipment(id) | Originating machine |
| `sensor_type` | VARCHAR(50) | NOT NULL | temperature, vibration, fuel, etc. |
| `value` | NUMERIC(10, 2)| NOT NULL | Numerical reading |
| `unit` | VARCHAR(20) | NOT NULL | Engineering unit (°C, mm/s, bar) |
| `status` | VARCHAR(30) | DEFAULT 'Normal' | Normal, Warning, Critical |
| `timestamp`| TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Packet arrival timestamp |
| `metadata` | JSONB | DEFAULT '{}' | Extended diagnostics dictionary |

### `alerts`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Incident record ID |
| `project_id`| INTEGER | REFERENCES projects(id) | Associated project |
| `equipment_id`| INTEGER | REFERENCES equipment(id) | Machinery source (optional) |
| `type` | VARCHAR(50) | NOT NULL | Equipment, Safety, Schedule |
| `severity` | VARCHAR(20) | NOT NULL | Critical, Warning, Info |
| `message` | TEXT | NOT NULL | Incident description |
| `status` | VARCHAR(30) | DEFAULT 'Open' | Open, Acknowledged, Resolved |
