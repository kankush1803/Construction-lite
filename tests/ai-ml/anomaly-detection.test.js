import { describe, it, expect } from 'vitest';
const EquipmentAnomalyModel = require('../../src/ai-ml/models/equipment-anomaly.model');
const anomalyDetectionService = require('../../src/ai-ml/services/anomaly-detection.service');

describe('AI/ML: Anomaly Detection Model & Service', () => {
  const model = new EquipmentAnomalyModel();

  it('should identify normal operating temperature as non-anomalous', () => {
    const result = model.predict('temperature', 80.0);
    expect(result.isAnomaly).toBe(false);
    expect(result.severity).toBe('Normal');
  });

  it('should flag temperature exceeding threshold as Critical anomaly', () => {
    const result = model.predict('temperature', 115.0);
    expect(result.isAnomaly).toBe(true);
    expect(result.severity).toBe('Critical');
  });

  it('should flag excessive vibration as anomaly', () => {
    const result = model.predict('vibration', 8.2);
    expect(result.isAnomaly).toBe(true);
  });

  it('anomalyDetectionService should evaluate reading correctly', () => {
    const evaluation = anomalyDetectionService.evaluateSensorReading({
      sensor_type: 'temperature',
      value: 120,
    });
    expect(evaluation.isAnomaly).toBe(true);
    expect(evaluation.severity).toBe('Critical');
  });
});
