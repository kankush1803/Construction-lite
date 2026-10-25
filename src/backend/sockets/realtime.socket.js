const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;

function initRealtimeSocket(server, frontendUrl = '*') {
  io = new Server(server, {
    cors: {
      origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Real-time client connected: ${socket.id}`);

    socket.emit('connection:ack', {
      connected: true,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
      logger.info(`Real-time client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function broadcastTelemetry(reading) {
  if (io) {
    io.emit('telemetry:reading', reading);
  }
}

function broadcastAlert(alert) {
  if (io) {
    io.emit('alert:new', alert);
  }
}

function broadcastDashboardUpdate(data) {
  if (io) {
    io.emit('dashboard:update', data);
  }
}

module.exports = {
  initRealtimeSocket,
  broadcastTelemetry,
  broadcastAlert,
  broadcastDashboardUpdate,
  getIO: () => io,
};
