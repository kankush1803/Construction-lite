import { describe, it, expect, vi } from 'vitest';
const simulator = require('../../src/iot/simulator');
const { generateEquipmentTelemetry } = require('../../src/iot/equipmentSensor');
const { generateWorkerTelemetry } = require('../../src/iot/workerSensor');

describe('IoT: Sensors and Telemetry Generation', () => {
  it('generateEquipmentTelemetry should generate valid sensor readings for equipment', () => {
    const mockEquipment = {
      id: 1,
      name: 'Test Excavator',
      health_score: 95,
      fuel_level: 80,
    };

    const readings = generateEquipmentTelemetry(mockEquipment);
    expect(Array.isArray(readings)).toBe(true);
    expect(readings.length).toBeGreaterThan(0);

    const tempReading = readings.find((r) => r.sensor_type === 'temperature');
    expect(tempReading).toBeDefined();
    expect(tempReading.value).toBeGreaterThan(0);
    expect(tempReading.unit).toBe('°C');
  });

  it('generateWorkerTelemetry should generate valid wearable vitals', () => {
    const mockWorker = {
      id: 1,
      full_name: 'Test Worker',
      trade: 'Civil',
    };

    const telemetry = generateWorkerTelemetry(mockWorker);
    expect(telemetry.worker_id).toBe(1);
    expect(telemetry.heartRate.value).toBeGreaterThan(50);
    expect(telemetry.bodyTemperature.value).toBeGreaterThan(35);
    expect(telemetry.ppeStatus).toBeDefined();
  });

  it('simulator should export lifecycle methods start and stop', () => {
    expect(typeof simulator.start).toBe('function');
    expect(typeof simulator.stop).toBe('function');
    expect(typeof simulator.runCycle).toBe('function');
  });
});
