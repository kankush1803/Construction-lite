import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../../src/backend/app');

describe('Backend: Equipment API', () => {
  it('GET /api/equipment should return equipment list', async () => {
    const response = await request(app).get('/api/equipment');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /api/equipment/summary should return aggregated equipment metrics', async () => {
    const response = await request(app).get('/api/equipment/summary');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBeDefined();
    expect(response.body.data.utilizationRate).toBeDefined();
  });
});
