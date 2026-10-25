import { describe, it, expect } from 'vitest';
const ProductivityModel = require('../../src/ai-ml/models/productivity.model');
const { calculateOEE, calculateProductivityScore } = require('../../src/ai-ml/utils/calculate-metrics');

describe('AI/ML: Productivity Calculations & Model', () => {
  it('calculateOEE should accurately multiply availability, performance, and quality', () => {
    // 90% availability, 85% performance, 95% quality = 0.9 * 0.85 * 0.95 = 0.72675 -> 72.7%
    const oee = calculateOEE(90, 85, 95);
    expect(oee).toBe(72.7);
  });

  it('calculateProductivityScore should calculate output ratio vs expected', () => {
    // 10 tasks completed in 20 hours (standard: 2 hrs/task => expected 10 tasks => 100%)
    const score = calculateProductivityScore(10, 20, 2);
    expect(score).toBe(100);
  });

  it('ProductivityModel evaluate should produce multi-factor weighted score', () => {
    const model = new ProductivityModel();
    const result = model.evaluate({
      equipmentUtilization: 80,
      workforceAttendance: 90,
      progressRatio: 0.95,
    });

    expect(result.productivityScore).toBeGreaterThanOrEqual(80);
    expect(result.efficiencyRating).toBeDefined();
    expect(result.factors).toBeDefined();
  });
});
