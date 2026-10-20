const API_BASE = 'http://localhost:5000/api';

export const dashboardService = {
  async getSummary() {
    if (window.electronAPI?.getDashboardSummary) {
      return window.electronAPI.getDashboardSummary();
    }
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    const json = await res.json();
    return json.data;
  },
};
