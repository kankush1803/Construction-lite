import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../../src/backend/app');

describe('Backend: Projects API', () => {
  it('GET /api/projects should return an array of projects', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/projects/:id should return single project details', async () => {
    const response = await request(app).get('/api/projects/1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.name).toBeDefined();
  });

  it('POST /api/projects should validate payload using Zod', async () => {
    const invalidPayload = { name: 'A' }; // Missing required fields
    const response = await request(app).post('/api/projects').send(invalidPayload);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
