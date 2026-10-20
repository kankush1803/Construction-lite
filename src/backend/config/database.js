const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

let pool = null;
let isConnected = false;

try {
  pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,
    max: env.db.max,
    idleTimeoutMillis: env.db.idleTimeoutMillis,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    logger.warn('Unexpected error on idle PostgreSQL client (will use memory store if disconnected): ' + err.message);
  });
} catch (error) {
  logger.warn('Failed to initialize PostgreSQL pool: ' + error.message);
}

// In-memory mock store fallback if PostgreSQL is not available
const memoryStore = {
  projects: [
    { id: 1, name: 'Skyline Heights Tower A', code: 'PRJ-2026-001', client: 'Metro Urban Corp', location: 'Downtown Sector 4', budget: 45000000, spent: 28500000, start_date: '2026-01-15', end_date: '2026-12-30', progress: 68.5, status: 'In Progress' },
    { id: 2, name: 'Riverfront Commercial Plaza', code: 'PRJ-2026-002', client: 'Riverfront Dev Ltd', location: 'East River Boulevard', budget: 72000000, spent: 31000000, start_date: '2026-03-01', end_date: '2027-04-15', progress: 43.0, status: 'In Progress' },
    { id: 3, name: 'Greenwood Logistics Hub', code: 'PRJ-2026-003', client: 'Apex Cargo Systems', location: 'Industrial Zone West', budget: 18500000, spent: 16800000, start_date: '2025-10-01', end_date: '2026-11-20', progress: 91.2, status: 'Near Completion' },
    { id: 4, name: 'Oakwood Medical Center', code: 'PRJ-2026-004', client: 'HealthFirst Properties', location: 'North Health District', budget: 38000000, spent: 5200000, start_date: '2026-08-01', end_date: '2027-09-30', progress: 14.0, status: 'Planning' },
  ],
  equipment: [
    { id: 1, project_id: 1, name: 'CAT 336 Hydraulic Excavator', type: 'Excavator', serial_number: 'EQ-CAT-336-01', status: 'Active', health_score: 94.5, fuel_level: 78, hours_operated: 1420.5, location: 'Sector 4 Excavation Zone' },
    { id: 2, project_id: 1, name: 'Liebherr 280 EC-H Tower Crane', type: 'Tower Crane', serial_number: 'EQ-LIE-280-01', status: 'Active', health_score: 98.0, fuel_level: 92, hours_operated: 2150.0, location: 'Tower A Center Core' },
    { id: 3, project_id: 1, name: 'Komatsu D65PX Bulldozer', type: 'Bulldozer', serial_number: 'EQ-KOM-065-02', status: 'Idle', health_score: 82.0, fuel_level: 45, hours_operated: 890.0, location: 'South Access Ramp' },
    { id: 4, project_id: 2, name: 'Putzmeister BSF 36 Concrete Pump', type: 'Concrete Mixer', serial_number: 'EQ-PUT-036-01', status: 'Active', health_score: 91.0, fuel_level: 65, hours_operated: 640.25, location: 'Plaza Foundation Deck' },
    { id: 5, project_id: 2, name: 'Volvo FMX Dump Truck 01', type: 'Dump Truck', serial_number: 'EQ-VOL-FMX-01', status: 'Active', health_score: 88.5, fuel_level: 55, hours_operated: 1780.0, location: 'Transit Route B' },
    { id: 6, project_id: 3, name: 'Caterpillar 950M Wheel Loader', type: 'Loader', serial_number: 'EQ-CAT-950-01', status: 'Maintenance', health_score: 64.0, fuel_level: 30, hours_operated: 3420.0, location: 'Main Depot Workshop' },
  ],
  workers: [
    { id: 1, project_id: 1, full_name: 'Marcus Vance', role: 'Site Foreman', trade: 'Civil', shift: 'Day', status: 'On Site', safety_certified: true },
    { id: 2, project_id: 1, full_name: 'Elena Rostova', role: 'Heavy Crane Operator', trade: 'Mechanical', shift: 'Day', status: 'On Site', safety_certified: true },
    { id: 3, project_id: 1, full_name: 'David Chen', role: 'Lead Structural Welder', trade: 'Mechanical', shift: 'Day', status: 'On Site', safety_certified: true },
    { id: 4, project_id: 1, full_name: 'Amina Diallo', role: 'Safety Inspector', trade: 'Safety', shift: 'Day', status: 'On Site', safety_certified: true },
    { id: 5, project_id: 2, full_name: 'Carlos Mendez', role: 'Concrete Operations Lead', trade: 'Civil', shift: 'Day', status: 'On Site', safety_certified: true },
    { id: 6, project_id: 2, full_name: 'Rachel Adams', role: 'Electrical Systems Lead', trade: 'Electrical', shift: 'Day', status: 'On Break', safety_certified: true },
    { id: 7, project_id: 3, full_name: 'Jamal Wright', role: 'Heavy Equipment Tech', trade: 'Mechanical', shift: 'Morning', status: 'Off Site', safety_certified: true },
  ],
  alerts: [
    { id: 1, project_id: 3, equipment_id: 6, type: 'Equipment', severity: 'Critical', message: 'Excessive vibration detected on Caterpillar 950M rear axle bearing (7.8 mm/s). Maintenance required.', status: 'Open', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, project_id: 1, equipment_id: 3, type: 'Equipment', severity: 'Warning', message: 'Engine coolant temperature elevated on Komatsu D65PX (104.2 °C).', status: 'Acknowledged', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, project_id: 1, equipment_id: null, type: 'Safety', severity: 'Warning', message: 'Wind gusts reaching 35 km/h at Crane 01 elevation.', status: 'Open', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, project_id: 2, equipment_id: null, type: 'Schedule', severity: 'Info', message: 'Foundation concrete pour completed ahead of schedule.', status: 'Open', created_at: new Date(Date.now() - 14400000).toISOString() },
  ],
  telemetry: [],
};

async function query(text, params = []) {
  if (pool) {
    try {
      const res = await pool.query(text, params);
      isConnected = true;
      return res;
    } catch (err) {
      logger.warn(`PostgreSQL query error, using memory fallback: ${err.message}`);
    }
  }
  return { rows: [] };
}

module.exports = {
  pool,
  query,
  memoryStore,
  isLiveConnection: () => isConnected,
};
