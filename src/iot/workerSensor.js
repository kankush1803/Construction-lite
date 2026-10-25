const sensorConfig = require('./sensorConfig');

function generateWorkerTelemetry(worker) {
  const cfg = sensorConfig.worker;
  const heartRate = Math.round(72 + (Math.random() * 25));
  const bodyTemp = Math.round((36.6 + (Math.random() * 0.8)) * 10) / 10;
  const helmetOn = Math.random() > 0.02; // 98% helmet compliance

  return {
    worker_id: worker.id,
    worker_name: worker.full_name,
    trade: worker.trade,
    heartRate: {
      value: heartRate,
      unit: cfg.heartRate.unit,
      status: heartRate >= cfg.heartRate.warningThreshold ? 'Warning' : 'Normal',
    },
    bodyTemperature: {
      value: bodyTemp,
      unit: cfg.bodyTemperature.unit,
      status: bodyTemp >= cfg.bodyTemperature.warningThreshold ? 'Warning' : 'Normal',
    },
    ppeStatus: {
      helmetEquipped: helmetOn,
      vestEquipped: true,
      harnessEquipped: true,
    },
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  generateWorkerTelemetry,
};
