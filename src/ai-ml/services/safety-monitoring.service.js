const SafetyRiskModel = require('../models/safety-risk.model');

const model = new SafetyRiskModel();

const safetyMonitoringService = {
  assessSiteRisk(siteData = {}) {
    return model.predictRisk({
      heatIndex: siteData.heatIndex || 27,
      workerFatigue: siteData.workerFatigue || 0.15,
      equipmentFaults: siteData.equipmentFaults || 0,
      ppeViolation: siteData.ppeViolation || false,
    });
  },
};

module.exports = safetyMonitoringService;
