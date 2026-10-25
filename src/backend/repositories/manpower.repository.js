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
};

module.exports = manpowerRepository;
