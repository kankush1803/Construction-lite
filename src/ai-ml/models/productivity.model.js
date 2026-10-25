class ProductivityModel {
  constructor() {
    this.weights = {
      equipmentUtilization: 0.35,
      workforceAttendance: 0.35,
      paceOfProgress: 0.30,
    };
  }

  evaluate({ equipmentUtilization = 80, workforceAttendance = 85, progressRatio = 1.0 }) {
    // Score between 0 and 100
    const eqScore = Math.min(Math.max(equipmentUtilization, 0), 100);
    const wfScore = Math.min(Math.max(workforceAttendance, 0), 100);
    const prScore = Math.min(progressRatio * 100, 100);

    const score = Math.round(
      eqScore * this.weights.equipmentUtilization +
      wfScore * this.weights.workforceAttendance +
      prScore * this.weights.paceOfProgress
    );

    let efficiencyRating = 'Optimal';
    if (score < 60) efficiencyRating = 'Critical Lag';
    else if (score < 75) efficiencyRating = 'Moderate Lag';
    else if (score < 90) efficiencyRating = 'Good';

    return {
      productivityScore: score,
      efficiencyRating,
      factors: {
        equipmentUtilization: eqScore,
        workforceAttendance: wfScore,
        paceOfProgress: prScore,
      },
    };
  }
}

module.exports = ProductivityModel;
