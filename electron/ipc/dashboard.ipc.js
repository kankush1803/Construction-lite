const dashboardService = require('../../src/backend/services/dashboard.service');

function registerDashboardIPC(ipcMain) {
  ipcMain.handle('dashboard:get-summary', async () => {
    return dashboardService.getSummary();
  });
}

module.exports = registerDashboardIPC;
