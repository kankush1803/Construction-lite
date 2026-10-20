const { query, memoryStore } = require('../config/database');

const projectRepository = {
  async findAll() {
    const result = await query('SELECT * FROM projects ORDER BY id ASC');
    if (result && result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return memoryStore.projects;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    const result = await query('SELECT * FROM projects WHERE id = $1', [numId]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return memoryStore.projects.find((p) => p.id === numId) || null;
  },

  async create(data) {
    const result = await query(
      `INSERT INTO projects (name, code, client, location, budget, spent, start_date, end_date, progress, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [data.name, data.code, data.client, data.location, data.budget, data.spent || 0, data.start_date, data.end_date, data.progress || 0, data.status || 'In Progress']
    );
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    const newProject = { id: memoryStore.projects.length + 1, ...data };
    memoryStore.projects.push(newProject);
    return newProject;
  },

  async updateProgress(id, progress) {
    const numId = parseInt(id, 10);
    const result = await query(
      'UPDATE projects SET progress = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [progress, numId]
    );
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    const proj = memoryStore.projects.find((p) => p.id === numId);
    if (proj) {
      proj.progress = progress;
      return proj;
    }
    return null;
  },
};

module.exports = projectRepository;
