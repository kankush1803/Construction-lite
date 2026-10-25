const { memoryStore } = require('../config/database');

const safetyService = {
  async getOverview() {
    const alerts = memoryStore.alerts || [];
    const safetyAlerts = alerts.filter((a) => a.type === 'Safety');
    const openSafetyAlerts = safetyAlerts.filter((a) => a.status === 'Open');

    return {
      incidentFreeDays: 142,
      riskLevel: openSafetyAlerts.length > 0 ? 'Moderate' : 'Low',
      activeSafetyAlerts: openSafetyAlerts.length,
      ppeComplianceRate: 98.4,
      inspectionsPassedThisMonth: 12,
      totalInspectionsThisMonth: 12,
      recentAlerts: safetyAlerts.slice(0, 5),
    };
  },
};

module.exports = safetyService;
