const equipmentRepository = require('../backend/repositories/equipment.repository');
const { generateEquipmentTelemetry } = require('./equipmentSensor');
const { processTelemetryReading } = require('./telemetryProcessor');
const logger = require('../backend/utils/logger');
const env = require('../backend/config/env');

let simulationInterval = null;
let isRunning = false;

async function runCycle() {
  try {
    const equipmentList = await equipmentRepository.findAll();
    if (!equipmentList || equipmentList.length === 0) return;

    // Pick 1-2 random active or idle pieces of equipment to emit telemetry
    const target = equipmentList[Math.floor(Math.random() * equipmentList.length)];
    const readings = generateEquipmentTelemetry(target);

    // Pick 1 reading from this target to simulate an IoT packet arrival
    const reading = readings[Math.floor(Math.random() * readings.length)];
    await processTelemetryReading(reading);
  } catch (err) {
    logger.error('Error during IoT simulator cycle:', err);
  }
}

function start(intervalMs = env.iot.intervalMs || 3000) {
  if (isRunning) return;
  isRunning = true;
  logger.info(`Starting IoT Sensor Simulator (interval: ${intervalMs}ms)`);
  simulationInterval = setInterval(runCycle, intervalMs);
}

function stop() {
  if (!isRunning) return;
  clearInterval(simulationInterval);
  simulationInterval = null;
  isRunning = false;
  logger.info('IoT Sensor Simulator stopped');
}

module.exports = {
  start,
  stop,
  runCycle,
  isRunning: () => isRunning,
};
