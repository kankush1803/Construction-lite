const alertService = require('../services/alert.service');

const alertsController = {
  async getAll(req, res, next) {
    try {
      const alerts = await alertService.getAllAlerts(req.query.status, req.query.severity);
      res.json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  },

  async acknowledge(req, res, next) {
    try {
      const updated = await alertService.acknowledge(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, error: { message: 'Alert not found' } });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const created = await alertService.createAlert(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = alertsController;
