const ProductivityModel = require('../models/productivity.model');

const model = new ProductivityModel();

const productivityService = {
  analyzeProjectProductivity(projectMetrics) {
    return model.evaluate(projectMetrics);
  },

  getProjectProductivityTrends() {
    return [
      { week: 'W1', score: 82, rating: 'Good' },
      { week: 'W2', score: 86, rating: 'Good' },
      { week: 'W3', score: 79, rating: 'Good' },
      { week: 'W4', score: 91, rating: 'Optimal' },
    ];
  },
};

module.exports = productivityService;
