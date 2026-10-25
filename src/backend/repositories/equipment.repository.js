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

  async allocateToProject(equipmentId, projectId) {
    const eqId = parseInt(equipmentId, 10);
    const projId = projectId ? parseInt(projectId, 10) : null;
    const sql = 'UPDATE equipment SET project_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await query(sql, [projId, eqId]);

    // Memory store synchronization
    const memItem = memoryStore.equipment.find((e) => e.id === eqId);
    if (memItem) {
      memItem.project_id = projId;
    }

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memItem || null;
  },

  async deallocateFromProject(equipmentId) {
    return this.allocateToProject(equipmentId, null);
  },

  async create(data) {
    const projId = data.project_id ? parseInt(data.project_id, 10) : null;
    const name = data.name;
    const type = data.type || 'General Machinery';
    const serialNumber = data.serial_number || `EQ-${Date.now()}`;
    const status = data.status || 'Active';
    const healthScore = parseFloat(data.health_score || 95.0);
    const fuelLevel = parseFloat(data.fuel_level || 90.0);
    const hoursOperated = parseFloat(data.hours_operated || 0.0);
    const location = data.location || 'Site Core';

    const sql = `
      INSERT INTO equipment (project_id, name, type, serial_number, status, health_score, fuel_level, hours_operated, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await query(sql, [projId, name, type, serialNumber, status, healthScore, fuelLevel, hoursOperated, location]);

    const newId = memoryStore.equipment.length ? Math.max(...memoryStore.equipment.map((e) => e.id)) + 1 : 1;
    const memRecord = {
      id: (result && result.rows && result.rows[0]?.id) || newId,
      project_id: projId,
      name,
      type,
      serial_number: serialNumber,
      status,
      health_score: healthScore,
      fuel_level: fuelLevel,
      hours_operated: hoursOperated,
      location,
    };
    memoryStore.equipment.push(memRecord);

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memRecord;
  },
};

module.exports = equipmentRepository;
