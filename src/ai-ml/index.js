const preprocess = require('./utils/preprocess');
const metrics = require('./utils/calculate-metrics');
const EquipmentAnomalyModel = require('./models/equipment-anomaly.model');
const ProductivityModel = require('./models/productivity.model');
const SafetyRiskModel = require('./models/safety-risk.model');
const anomalyDetectionService = require('./services/anomaly-detection.service');
const productivityService = require('./services/productivity.service');
const safetyMonitoringService = require('./services/safety-monitoring.service');
const sampleTelemetry = require('./data/sample-telemetry');

module.exports = {
  preprocess,
  metrics,
  models: {
    EquipmentAnomalyModel,
    ProductivityModel,
    SafetyRiskModel,
  },
  services: {
    anomalyDetectionService,
    productivityService,
    safetyMonitoringService,
  },
  sampleTelemetry,
};
