const sensorConfig = require('./sensorConfig');

function generateEquipmentTelemetry(equipment) {
  const isHealthy = equipment.health_score > 75;
  const cfg = sensorConfig.equipment;

  // Generate realistic sensor telemetry with occasional jitter/variations
  const tempVariance = isHealthy ? (Math.random() * 15 - 5) : (Math.random() * 25 + 10);
  const temp = Math.round((80 + tempVariance) * 10) / 10;

  const vibVariance = isHealthy ? Math.random() * 2.2 : Math.random() * 5.0 + 3.0;
  const vibration = Math.round((1.5 + vibVariance) * 100) / 100;

  const fuel = Math.max(5, Math.round((equipment.fuel_level - (Math.random() * 0.5)) * 10) / 10);

  const pressureVariance = (Math.random() * 40 - 20);
  const hydraulicPressure = Math.round(250 + pressureVariance);

  return [
    {
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      sensor_type: 'temperature',
      value: temp,
      unit: cfg.temperature.unit,
      status: temp >= cfg.temperature.criticalThreshold ? 'Critical' : temp >= cfg.temperature.warningThreshold ? 'Warning' : 'Normal',
      timestamp: new Date().toISOString(),
    },
    {
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      sensor_type: 'vibration',
      value: vibration,
      unit: cfg.vibration.unit,
      status: vibration >= cfg.vibration.criticalThreshold ? 'Critical' : vibration >= cfg.vibration.warningThreshold ? 'Warning' : 'Normal',
      timestamp: new Date().toISOString(),
    },
    {
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      sensor_type: 'fuel',
      value: fuel,
      unit: cfg.fuel.unit,
      status: fuel <= cfg.fuel.criticalThreshold ? 'Critical' : fuel <= cfg.fuel.warningThreshold ? 'Warning' : 'Normal',
      timestamp: new Date().toISOString(),
    },
    {
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      sensor_type: 'hydraulicPressure',
      value: hydraulicPressure,
      unit: cfg.hydraulicPressure.unit,
      status: hydraulicPressure >= cfg.hydraulicPressure.criticalThreshold ? 'Critical' : hydraulicPressure >= cfg.hydraulicPressure.warningThreshold ? 'Warning' : 'Normal',
      timestamp: new Date().toISOString(),
    },
  ];
}

module.exports = {
  generateEquipmentTelemetry,
};
