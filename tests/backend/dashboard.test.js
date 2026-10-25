import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../../src/backend/app');

describe('Backend: Dashboard API', () => {
  it('GET /api/dashboard/summary should return comprehensive stats', async () => {
    const response = await request(app).get('/api/dashboard/summary');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.stats).toBeDefined();
    expect(response.body.data.stats.totalProjects).toBeGreaterThan(0);
    expect(response.body.data.chartData).toBeDefined();
  });
});
