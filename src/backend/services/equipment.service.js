const equipmentRepository = require('../repositories/equipment.repository');
const telemetryRepository = require('../repositories/telemetry.repository');

const equipmentService = {
  async getAllEquipment(projectId = null) {
    const list = await equipmentRepository.findAll(projectId);
    return list;
  },

  async getEquipmentById(id) {
    const item = await equipmentRepository.findById(id);
    if (!item) return null;
    const recentTelemetry = await telemetryRepository.getRecent(id, 20);
    return {
      ...item,
      recentTelemetry,
    };
  },

  async getSummary() {
    const all = await equipmentRepository.findAll();
    const active = all.filter((e) => e.status === 'Active').length;
    const idle = all.filter((e) => e.status === 'Idle').length;
    const maintenance = all.filter((e) => e.status === 'Maintenance').length;
    const offline = all.filter((e) => e.status === 'Offline').length;

    const avgHealth = all.length
      ? Math.round(all.reduce((acc, curr) => acc + parseFloat(curr.health_score || 0), 0) / all.length)
      : 100;

    return {
      total: all.length,
      active,
      idle,
      maintenance,
      offline,
      averageHealth: avgHealth,
      utilizationRate: all.length ? Math.round((active / all.length) * 100) : 0,
    };
  },
};

module.exports = equipmentService;
