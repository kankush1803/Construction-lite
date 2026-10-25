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

  it('POST /api/projects should successfully create a new project with 7 fields', async () => {
    const newProject = {
      code: 'PRJ-TEST-999',
      name: 'Pacific Heights Tower',
      client: 'Pacific Development Ltd',
      location: 'West Marina Bay',
      budget: 35000000,
      progress: 0,
      status: 'Planned',
    };
    const response = await request(app).post('/api/projects').send(newProject);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('PRJ-TEST-999');
    expect(response.body.data.name).toBe('Pacific Heights Tower');
    expect(Number(response.body.data.budget)).toBe(35000000);
  });

  it('POST /api/projects should reject duplicate project codes with 409 Conflict', async () => {
    const duplicateProject = {
      code: 'PRJ-TEST-999', // Already exists from previous test
      name: 'Duplicate Project Name',
      client: 'Another Client',
      location: 'Another Location',
      budget: 12000000,
      progress: 0,
      status: 'Planned',
    };
    const response = await request(app).post('/api/projects').send(duplicateProject);
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toMatch(/already exists/i);
  });

  it('DELETE /api/projects/:id should remove project', async () => {
    const listBefore = await request(app).get('/api/projects');
    const createdItem = listBefore.body.data.find((p) => p.code === 'PRJ-TEST-999');
    if (createdItem) {
      const delResponse = await request(app).delete(`/api/projects/${createdItem.id}`);
      expect(delResponse.status).toBe(200);
      expect(delResponse.body.success).toBe(true);
    }
  });
});
