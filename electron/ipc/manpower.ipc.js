const manpowerService = require('../../src/backend/services/manpower.service');

function registerManpowerIPC(ipcMain) {
  ipcMain.handle('manpower:get-all', async (_event, projectId) => {
    return manpowerService.getAllWorkers(projectId);
  });

  ipcMain.handle('manpower:get-summary', async () => {
    return manpowerService.getSummary();
  });
}

module.exports = registerManpowerIPC;
