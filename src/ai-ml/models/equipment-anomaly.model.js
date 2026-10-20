const { calculateZScore } = require('../utils/preprocess');

class EquipmentAnomalyModel {
  constructor(thresholds = {}) {
    this.zScoreThreshold = thresholds.zScoreThreshold || 2.5;
    this.limits = {
      temperature: { warning: 95, critical: 105, mean: 80, std: 6 },
      vibration: { warning: 5.0, critical: 7.0, mean: 2.2, std: 0.8 },
      hydraulicPressure: { warning: 340, critical: 380, mean: 250, std: 25 },
    };
  }

  predict(sensorType, value) {
    const config = this.limits[sensorType];
    if (!config) {
      return { isAnomaly: false, score: 0, reason: null };
    }

    const zScore = calculateZScore(value, config.mean, config.std);
    const absZ = Math.abs(zScore);

    if (value >= config.critical || absZ >= 3.5) {
      return {
        isAnomaly: true,
        severity: 'Critical',
        score: Math.min(absZ / 4, 1.0),
        reason: `${sensorType} is critically elevated at ${value} (z-score: ${absZ.toFixed(2)})`,
      };
    }

    if (value >= config.warning || absZ >= this.zScoreThreshold) {
      return {
        isAnomaly: true,
        severity: 'Warning',
        score: Math.min(absZ / 4, 0.75),
        reason: `${sensorType} is outside normal bounds at ${value} (z-score: ${absZ.toFixed(2)})`,
      };
    }

    return {
      isAnomaly: false,
      severity: 'Normal',
      score: Math.min(absZ / 4, 0.3),
      reason: 'Reading within normal operating parameters',
    };
  }
}

module.exports = EquipmentAnomalyModel;
