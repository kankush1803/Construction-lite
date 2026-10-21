
const { contextBridge, ipcRenderer } = require("electron");

// Expose safe, selected APIs to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,

  // Dashboard
  getDashboardSummary: () =>
    ipcRenderer.invoke("dashboard:get-summary"),

  // Projects
  getProjects: () =>
    ipcRenderer.invoke("projects:get-all"),

  getProjectById: (id) =>
    ipcRenderer.invoke("projects:get-by-id", id),

  // Equipment
  getEquipment: (projectId) =>
    ipcRenderer.invoke("equipment:get-all", projectId),

  getEquipmentSummary: () =>
    ipcRenderer.invoke("equipment:get-summary"),

  // Manpower
  getManpower: (projectId) =>
    ipcRenderer.invoke("manpower:get-all", projectId),

  getManpowerSummary: () =>
    ipcRenderer.invoke("manpower:get-summary"),

  // Alerts
  getAlerts: (status, severity) =>
    ipcRenderer.invoke("alerts:get-all", status, severity),

  acknowledgeAlert: (id) =>
    ipcRenderer.invoke("alerts:acknowledge", id),
});
