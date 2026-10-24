import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

export default function Header() {
  const { activeTab, isSocketConnected, data, notificationPanelOpen, setNotificationPanelOpen } = useDashboard();

  const titleMap = {
    dashboard: 'Site Operations Dashboard',
    projects: 'Project Management',
    project_details: 'Project Details & Deep Dive',
    equipment: 'Fleet & IoT Equipment Telemetry',
    manpower: 'Workforce & Site Deployment',
    safety: 'Site Safety & Environmental Compliance',
    alerts: 'Central Alerts & Incidents',
    analytics: 'Performance & Productivity Analytics',
    settings: 'System Configuration',
  };

  const criticalCount = data?.stats?.criticalAlertsCount || 0;

  return (
    <header className="app-header">
      <div className="header-title">
        <h2>{titleMap[activeTab] || 'Construction Monitor'}</h2>
      </div>

      <div className="header-actions">
        <div className="live-badge" title={isSocketConnected ? 'Live Socket.IO Stream Active' : 'Connecting to Realtime Hub...'}>
          <div className="live-dot" style={{ backgroundColor: isSocketConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}></div>
          <span>{isSocketConnected ? 'IoT Telemetry Live' : 'Connecting...'}</span>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          style={{ position: 'relative' }}
        >
          <span>🔔</span>
          <span>Alerts</span>
          {criticalCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-rose)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.7rem',
                padding: '2px 6px',
                fontWeight: '700',
              }}
            >
              {criticalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
