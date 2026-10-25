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

  createProject: (data) =>
    ipcRenderer.invoke("projects:create", data),

  updateProject: (id, data) =>
    ipcRenderer.invoke("projects:update", id, data),

  deleteProject: (id) =>
    ipcRenderer.invoke("projects:delete", id),

  allocateEquipment: (projectId, equipmentIds) =>
    ipcRenderer.invoke("projects:allocate-equipment", projectId, equipmentIds),

  deallocateEquipment: (projectId, equipmentId) =>
    ipcRenderer.invoke("projects:deallocate-equipment", projectId, equipmentId),

  assignWorkers: (projectId, workerIds) =>
    ipcRenderer.invoke("projects:assign-workers", projectId, workerIds),

  unassignWorker: (projectId, workerId) =>
    ipcRenderer.invoke("projects:unassign-worker", projectId, workerId),

  createEquipmentForProject: (projectId, data) =>
    ipcRenderer.invoke("projects:create-equipment", projectId, data),

  createWorkerForProject: (projectId, data) =>
    ipcRenderer.invoke("projects:create-worker", projectId, data),

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
