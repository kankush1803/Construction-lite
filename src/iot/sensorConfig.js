// IoT Sensor Configuration & Operating Thresholds
const sensorConfig = {
  equipment: {
    temperature: {
      unit: '°C',
      normalMin: 65,
      normalMax: 92,
      warningThreshold: 98,
      criticalThreshold: 105,
    },
    vibration: {
      unit: 'mm/s',
      normalMin: 0.8,
      normalMax: 4.0,
      warningThreshold: 5.5,
      criticalThreshold: 7.2,
    },
    fuel: {
      unit: '%',
      normalMin: 25,
      normalMax: 100,
      warningThreshold: 15,
      criticalThreshold: 8,
    },
    hydraulicPressure: {
      unit: 'bar',
      normalMin: 180,
      normalMax: 320,
      warningThreshold: 350,
      criticalThreshold: 380,
    },
    engineRpm: {
      unit: 'rpm',
      normalMin: 800,
      normalMax: 2200,
      warningThreshold: 2400,
      criticalThreshold: 2600,
    },
  },
  worker: {
    heartRate: {
      unit: 'bpm',
      normalMin: 60,
      normalMax: 100,
      warningThreshold: 120,
      criticalThreshold: 140,
    },
    bodyTemperature: {
      unit: '°C',
      normalMin: 36.3,
      normalMax: 37.3,
      warningThreshold: 38.0,
      criticalThreshold: 39.0,
    },
  },
};

module.exports = sensorConfig;
