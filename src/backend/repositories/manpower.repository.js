const { query, memoryStore } = require('../config/database');

const manpowerRepository = {
  async findAll(projectId = null) {
    let sql = 'SELECT * FROM workers';
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
      return memoryStore.workers.filter((w) => w.project_id === parseInt(projectId, 10));
    }
    return memoryStore.workers;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    const result = await query('SELECT * FROM workers WHERE id = $1', [numId]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memoryStore.workers.find((w) => w.id === numId) || null;
  },

  async assignToProject(workerId, projectId) {
    const wId = parseInt(workerId, 10);
    const projId = projectId ? parseInt(projectId, 10) : null;
    const sql = 'UPDATE workers SET project_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await query(sql, [projId, wId]);

    // Memory store synchronization
    const memItem = memoryStore.workers.find((w) => w.id === wId);
    if (memItem) {
      memItem.project_id = projId;
    }

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memItem || null;
  },

  async unassignFromProject(workerId) {
    return this.assignToProject(workerId, null);
  },

  async create(data) {
    const projId = data.project_id ? parseInt(data.project_id, 10) : null;
    const fullName = data.full_name;
    const role = data.role || 'General Operative';
    const trade = data.trade || 'Civil';
    const shift = data.shift || 'Day';
    const status = data.status || 'On Site';
    const safetyCertified = data.safety_certified !== undefined ? Boolean(data.safety_certified) : true;

    const sql = `
      INSERT INTO workers (project_id, full_name, role, trade, shift, status, safety_certified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await query(sql, [projId, fullName, role, trade, shift, status, safetyCertified]);

    const newId = memoryStore.workers.length ? Math.max(...memoryStore.workers.map((w) => w.id)) + 1 : 1;
    const memRecord = {
      id: (result && result.rows && result.rows[0]?.id) || newId,
      project_id: projId,
      full_name: fullName,
      role,
      trade,
      shift,
      status,
      safety_certified: safetyCertified,
    };
    memoryStore.workers.push(memRecord);

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memRecord;
  },
};

module.exports = manpowerRepository;
