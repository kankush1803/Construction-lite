const EquipmentAnomalyModel = require('../models/equipment-anomaly.model');
const env = require('../../backend/config/env');

const model = new EquipmentAnomalyModel({
  zScoreThreshold: env.ai ? env.ai.anomalyZscoreThreshold : 2.5,
});

const anomalyDetectionService = {
  evaluateSensorReading(reading) {
    const result = model.predict(reading.sensor_type, reading.value);
    return {
      isAnomaly: result.isAnomaly,
      severity: result.severity,
      confidence: result.score,
      message: result.reason,
    };
  },

  batchDetect(readings = []) {
    return readings.map((r) => ({
      reading: r,
      evaluation: this.evaluateSensorReading(r),
    }));
  },
};

module.exports = anomalyDetectionService;
