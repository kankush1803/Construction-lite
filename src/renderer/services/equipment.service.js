const API_BASE = '/api';

export const equipmentService = {
  async getAll(projectId = null) {
    if (window.electronAPI?.getEquipment) {
      return window.electronAPI.getEquipment(projectId);
    }
    const url = projectId ? `${API_BASE}/equipment?projectId=${projectId}` : `${API_BASE}/equipment`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async getSummary() {
    if (window.electronAPI?.getEquipmentSummary) {
      return window.electronAPI.getEquipmentSummary();
    }
    const res = await fetch(`${API_BASE}/equipment/summary`);
    const json = await res.json();
    return json.data;
  },
};
