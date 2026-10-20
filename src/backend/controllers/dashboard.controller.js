const dashboardService = require('../services/dashboard.service');

const dashboardController = {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;
