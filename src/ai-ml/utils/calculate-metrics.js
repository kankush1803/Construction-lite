function calculateOEE(availability, performance, quality) {
  // Overall Equipment Effectiveness (0 - 100%)
  const a = Math.min(Math.max(availability, 0), 100) / 100;
  const p = Math.min(Math.max(performance, 0), 100) / 100;
  const q = Math.min(Math.max(quality, 0), 100) / 100;
  return Math.round(a * p * q * 100 * 10) / 10;
}

function calculateProductivityScore(tasksCompleted, hoursWorked, standardHoursPerTask = 2) {
  if (!hoursWorked || hoursWorked <= 0) return 0;
  const expectedTasks = hoursWorked / standardHoursPerTask;
  const ratio = (tasksCompleted / expectedTasks) * 100;
  return Math.min(Math.round(ratio * 10) / 10, 150);
}

function calculateCompositeRiskScore({ heatIndex = 25, workerFatigue = 0.2, equipmentFaults = 0, ppeViolation = false }) {
  let score = 0;

  // Environmental factor (0 - 30)
  if (heatIndex > 38) score += 30;
  else if (heatIndex > 32) score += 18;
  else if (heatIndex > 28) score += 8;

  // Fatigue factor (0 - 30)
  score += Math.min(workerFatigue * 30, 30);

  // Equipment faults factor (0 - 25)
  score += Math.min(equipmentFaults * 10, 25);

  // PPE compliance factor (0 - 15)
  if (ppeViolation) score += 15;

  return Math.min(Math.round(score), 100);
}

module.exports = {
  calculateOEE,
  calculateProductivityScore,
  calculateCompositeRiskScore,
};
