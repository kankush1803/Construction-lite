// Baseline sample telemetry data for AI/ML validation & tests
const sampleTelemetry = {
  normalReadings: [
    { equipment_id: 1, sensor_type: 'temperature', value: 78.5, unit: '°C' },
    { equipment_id: 1, sensor_type: 'temperature', value: 80.2, unit: '°C' },
    { equipment_id: 1, sensor_type: 'temperature', value: 82.0, unit: '°C' },
    { equipment_id: 1, sensor_type: 'temperature', value: 79.1, unit: '°C' },
    { equipment_id: 1, sensor_type: 'temperature', value: 81.4, unit: '°C' },
    { equipment_id: 1, sensor_type: 'vibration', value: 2.1, unit: 'mm/s' },
    { equipment_id: 1, sensor_type: 'vibration', value: 2.4, unit: 'mm/s' },
    { equipment_id: 1, sensor_type: 'vibration', value: 1.9, unit: 'mm/s' },
  ],
  anomalousReadings: [
    { equipment_id: 1, sensor_type: 'temperature', value: 114.5, unit: '°C' },
    { equipment_id: 1, sensor_type: 'vibration', value: 8.9, unit: 'mm/s' },
  ],
  workerMetrics: [
    { worker_id: 1, heartRate: 74, bodyTemp: 36.6, ppeCompliant: true },
    { worker_id: 2, heartRate: 82, bodyTemp: 36.8, ppeCompliant: true },
    { worker_id: 3, heartRate: 138, bodyTemp: 38.6, ppeCompliant: false }, // High risk
  ],
};

module.exports = sampleTelemetry;
