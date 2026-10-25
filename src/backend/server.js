const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { initRealtimeSocket } = require('./sockets/realtime.socket');
const simulator = require('../iot/simulator');

const server = http.createServer(app);

// Initialize WebSockets
initRealtimeSocket(server, env.frontendUrl);

server.listen(env.port, () => {
  logger.info(`Construction Monitor Backend Server running on port ${env.port} [${env.nodeEnv}]`);
  logger.info(`Health check available at http://localhost:${env.port}/api/health`);

  // Start IoT telemetry simulator if enabled
  if (env.iot.enabled) {
    simulator.start(env.iot.intervalMs);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  simulator.stop();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
