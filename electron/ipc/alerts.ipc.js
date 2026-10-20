const alertService = require('../../src/backend/services/alert.service');

function registerAlertsIPC(ipcMain) {
  ipcMain.handle('alerts:get-all', async (_event, status, severity) => {
    return alertService.getAllAlerts(status, severity);
  });

  ipcMain.handle('alerts:acknowledge', async (_event, id) => {
    return alertService.acknowledge(id);
  });
}

module.exports = registerAlertsIPC;
