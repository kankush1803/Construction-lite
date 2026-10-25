const { calculateCompositeRiskScore } = require('../utils/calculate-metrics');

class SafetyRiskModel {
  predictRisk({ heatIndex, workerFatigue, equipmentFaults, ppeViolation }) {
    const riskScore = calculateCompositeRiskScore({
      heatIndex,
      workerFatigue,
      equipmentFaults,
      ppeViolation,
    });

    let riskLevel = 'Low';
    if (riskScore >= 70) riskLevel = 'Critical';
    else if (riskScore >= 45) riskLevel = 'Moderate';

    const recommendations = [];
    if (heatIndex > 32) recommendations.push('Mandate hydration breaks every 45 minutes.');
    if (ppeViolation) recommendations.push('Site inspection required: PPE non-compliance detected.');
    if (equipmentFaults > 0) recommendations.push('Isolate affected equipment zones until clearance.');

    return {
      riskScore,
      riskLevel,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = SafetyRiskModel;
