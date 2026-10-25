const { query, memoryStore } = require('../config/database');

const telemetryRepository = {
  async save(record) {
    const result = await query(
      `INSERT INTO telemetry (equipment_id, sensor_type, value, unit, status, timestamp, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        record.equipment_id,
        record.sensor_type,
        record.value,
        record.unit,
        record.status || 'Normal',
        record.timestamp || new Date(),
        JSON.stringify(record.metadata || {}),
      ]
    );

    const saved = result && result.rows && result.rows[0] ? result.rows[0] : { id: memoryStore.telemetry.length + 1, ...record };
    memoryStore.telemetry.unshift(saved);
    if (memoryStore.telemetry.length > 500) {
      memoryStore.telemetry.pop();
    }
    return saved;
  },

  async getRecent(equipmentId = null, limit = 50) {
    let sql = 'SELECT * FROM telemetry';
    const params = [];
    if (equipmentId) {
      sql += ' WHERE equipment_id = $1';
      params.push(parseInt(equipmentId, 10));
    }
    sql += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows;
    }

    if (equipmentId) {
      return memoryStore.telemetry
        .filter((t) => t.equipment_id === parseInt(equipmentId, 10))
        .slice(0, limit);
    }
    return memoryStore.telemetry.slice(0, limit);
  },
};

module.exports = telemetryRepository;
