const telemetryRepository = require('../backend/repositories/telemetry.repository');
const anomalyDetectionService = require('../ai-ml/services/anomaly-detection.service');
const alertService = require('../backend/services/alert.service');
const { broadcastTelemetry, broadcastAlert } = require('../backend/sockets/realtime.socket');
const logger = require('../backend/utils/logger');

async function processTelemetryReading(reading) {
  try {
    // 1. Persist reading
    await telemetryRepository.save({
      equipment_id: reading.equipment_id,
      sensor_type: reading.sensor_type,
      value: reading.value,
      unit: reading.unit,
      status: reading.status,
      timestamp: reading.timestamp,
      metadata: { equipment_name: reading.equipment_name },
    });

    // 2. Broadcast to real-time clients
    broadcastTelemetry(reading);

    // 3. AI/ML Anomaly Detection Evaluation
    const anomalyCheck = anomalyDetectionService.evaluateSensorReading(reading);
    if (anomalyCheck.isAnomaly) {
      logger.warn(`Anomaly detected by AI/ML: ${anomalyCheck.message}`);

      const alert = await alertService.createAlert({
        project_id: reading.project_id || 1,
        equipment_id: reading.equipment_id,
        type: 'Equipment',
        severity: anomalyCheck.severity,
        message: `${reading.equipment_name || 'Equipment #' + reading.equipment_id}: ${anomalyCheck.message}`,
      });

      broadcastAlert(alert);
    }

    return { processed: true, anomaly: anomalyCheck.isAnomaly };
  } catch (error) {
    logger.error('Error processing telemetry reading:', error);
    return { processed: false, error: error.message };
  }
}

module.exports = {
  processTelemetryReading,
};
