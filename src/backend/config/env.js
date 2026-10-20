require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'construction_monitor',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  },
  iot: {
    enabled: process.env.IOT_SIMULATION_ENABLED !== 'false',
    intervalMs: parseInt(process.env.IOT_EMIT_INTERVAL_MS || '3000', 10),
  },
  ai: {
    anomalyZscoreThreshold: parseFloat(process.env.ANOMALY_ZSCORE_THRESHOLD || '2.5'),
    safetyRiskThreshold: parseFloat(process.env.SAFETY_RISK_THRESHOLD || '0.75'),
  },
};

module.exports = env;
