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

  async findByCode(code) {
    if (!code) return null;
    const cleanCode = String(code).trim().toUpperCase();
    const result = await query('SELECT * FROM projects WHERE UPPER(code) = $1', [cleanCode]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return (
      memoryStore.projects.find(
        (p) => String(p.code || p.project_code || '').trim().toUpperCase() === cleanCode
      ) || null
    );
  },

  async create(data) {
    const code = String(data.code || data.project_code || '').trim().toUpperCase();

    // Check for duplicate code
    const existing = await this.findByCode(code);
    if (existing) {
      const err = new Error(`Project code "${code}" already exists. Please choose a unique code.`);
      err.code = 'DUPLICATE_CODE';
      err.status = 409;
      throw err;
    }

    const name = String(data.name).trim();
    const client = String(data.client || 'Standard Client').trim();
    const location = String(data.location || 'Site Location').trim();
    const budget = Number(data.budget) || 0;
    const spent = Number(data.spent) || 0;
    const progress = Math.min(100, Math.max(0, Number(data.progress) || 0));
    const status = data.status || 'Planned';
    const startDate = data.start_date || new Date().toISOString().split('T')[0];
    const endDate = data.end_date || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];

    try {
      const result = await query(
        `INSERT INTO projects (name, code, client, location, budget, spent, start_date, end_date, progress, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [name, code, client, location, budget, spent, startDate, endDate, progress, status]
      );

      if (result && result.rows && result.rows.length > 0) {
        const created = result.rows[0];
        if (!memoryStore.projects.some((p) => p.id === created.id)) {
          memoryStore.projects.push(created);
        }
        return created;
      }
    } catch (dbErr) {
      if (dbErr.code === '23505' || String(dbErr.message).includes('unique')) {
        const err = new Error(`Project code "${code}" already exists.`);
        err.code = 'DUPLICATE_CODE';
        err.status = 409;
        throw err;
      }
      throw dbErr;
    }

    // In-memory fallback
    const nextId =
      memoryStore.projects.length > 0
        ? Math.max(...memoryStore.projects.map((p) => p.id || 0)) + 1
        : 1;

    const newProject = {
      id: nextId,
      name,
      code,
      project_code: code,
      client,
      location,
      budget,
      spent,
      start_date: startDate,
      end_date: endDate,
      progress,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.projects.push(newProject);
    return newProject;
  },

  async update(id, data) {
    const numId = parseInt(id, 10);
    const existing = await this.findById(numId);
    if (!existing) return null;

    if (data.code && String(data.code).trim().toUpperCase() !== String(existing.code).toUpperCase()) {
      const duplicate = await this.findByCode(data.code);
      if (duplicate && duplicate.id !== numId) {
        const err = new Error(`Project code "${data.code}" already exists.`);
        err.code = 'DUPLICATE_CODE';
        err.status = 409;
        throw err;
      }
    }

    const name = data.name !== undefined ? String(data.name).trim() : existing.name;
    const code = data.code !== undefined ? String(data.code).trim().toUpperCase() : existing.code;
    const client = data.client !== undefined ? String(data.client).trim() : existing.client;
    const location = data.location !== undefined ? String(data.location).trim() : existing.location;
    const budget = data.budget !== undefined ? Number(data.budget) : existing.budget;
    const progress = data.progress !== undefined ? Math.min(100, Math.max(0, Number(data.progress))) : existing.progress;
    const status = data.status !== undefined ? data.status : existing.status;

    try {
      const result = await query(
        `UPDATE projects 
         SET name = $1, code = $2, client = $3, location = $4, budget = $5, progress = $6, status = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 RETURNING *`,
        [name, code, client, location, budget, progress, status, numId]
      );

      if (result && result.rows && result.rows.length > 0) {
        const updated = result.rows[0];
        const memIdx = memoryStore.projects.findIndex((p) => p.id === numId);
        if (memIdx !== -1) memoryStore.projects[memIdx] = { ...memoryStore.projects[memIdx], ...updated };
        return updated;
      }
    } catch (dbErr) {
      if (dbErr.code === '23505' || String(dbErr.message).includes('unique')) {
        const err = new Error(`Project code "${code}" already exists.`);
        err.code = 'DUPLICATE_CODE';
        err.status = 409;
        throw err;
      }
      throw dbErr;
    }

    const memIdx = memoryStore.projects.findIndex((p) => p.id === numId);
    if (memIdx !== -1) {
      memoryStore.projects[memIdx] = {
        ...memoryStore.projects[memIdx],
        name,
        code,
        project_code: code,
        client,
        location,
        budget,
        progress,
        status,
        updated_at: new Date().toISOString(),
      };
      return memoryStore.projects[memIdx];
    }

    return null;
  },

  async delete(id) {
    const numId = parseInt(id, 10);
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING *', [numId]);
    const memIdx = memoryStore.projects.findIndex((p) => p.id === numId);
    let deleted = null;
    if (memIdx !== -1) {
      deleted = memoryStore.projects.splice(memIdx, 1)[0];
    }
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return deleted;
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
