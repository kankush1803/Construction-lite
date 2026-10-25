const API_BASE = '/api';

export const manpowerService = {
  async getAll(projectId = null) {
    if (window.electronAPI?.getManpower) {
      return window.electronAPI.getManpower(projectId);
    }
    const url = projectId ? `${API_BASE}/manpower?projectId=${projectId}` : `${API_BASE}/manpower`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async getSummary() {
    if (window.electronAPI?.getManpowerSummary) {
      return window.electronAPI.getManpowerSummary();
    }
    const res = await fetch(`${API_BASE}/manpower/summary`);
    const json = await res.json();
    return json.data;
  },
};
