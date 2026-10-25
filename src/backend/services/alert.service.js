const { query, memoryStore } = require('../config/database');

const alertService = {
  async getAllAlerts(status = null, severity = null) {
    let list = memoryStore.alerts || [];
    if (status) {
      list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }
    if (severity) {
      list = list.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
    }
    return list;
  },

  async acknowledge(id) {
    const numId = parseInt(id, 10);
    const alert = (memoryStore.alerts || []).find((a) => a.id === numId);
    if (alert) {
      alert.status = 'Acknowledged';
      alert.acknowledged_at = new Date().toISOString();
      return alert;
    }
    return null;
  },

  async createAlert(data) {
    const newAlert = {
      id: (memoryStore.alerts?.length || 0) + 1,
      project_id: data.project_id || null,
      equipment_id: data.equipment_id || null,
      type: data.type || 'System',
      severity: data.severity || 'Info',
      message: data.message,
      status: 'Open',
      created_at: new Date().toISOString(),
    };
    memoryStore.alerts.unshift(newAlert);
    return newAlert;
  },
};

module.exports = alertService;
