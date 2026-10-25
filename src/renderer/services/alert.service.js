const API_BASE = '/api';

export const alertService = {
  async getAll(status = null, severity = null) {
    if (window.electronAPI?.getAlerts) {
      return window.electronAPI.getAlerts(status, severity);
    }
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    const res = await fetch(`${API_BASE}/alerts?${params.toString()}`);
    const json = await res.json();
    return json.data;
  },

  async acknowledge(id) {
    if (window.electronAPI?.acknowledgeAlert) {
      return window.electronAPI.acknowledgeAlert(id);
    }
    const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, { method: 'PATCH' });
    const json = await res.json();
    return json.data;
  },
};
