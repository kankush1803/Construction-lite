const { query, memoryStore } = require('../config/database');

const equipmentRepository = {
  async findAll(projectId = null) {
    let sql = 'SELECT * FROM equipment';
    const params = [];
    if (projectId) {
      sql += ' WHERE project_id = $1';
      params.push(parseInt(projectId, 10));
    }
    sql += ' ORDER BY id ASC';
    const result = await query(sql, params);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows;
    }
    if (projectId) {
      return memoryStore.equipment.filter((e) => e.project_id === parseInt(projectId, 10));
    }
    return memoryStore.equipment;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    const result = await query('SELECT * FROM equipment WHERE id = $1', [numId]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memoryStore.equipment.find((e) => e.id === numId) || null;
  },

  async updateTelemetry(id, updates) {
    const numId = parseInt(id, 10);
    const eq = memoryStore.equipment.find((e) => e.id === numId);
    if (eq) {
      Object.assign(eq, updates);
    }
    return eq;
  },
};

module.exports = equipmentRepository;
