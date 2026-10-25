import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';

export default function Header() {
  const { activeTab, isSocketConnected, data, notificationPanelOpen, setNotificationPanelOpen, refresh } = useDashboard();
  const [refreshTime, setRefreshTime] = useState(() => formatTimestamp(new Date()));
  const [isRefreshing, setIsRefreshing] = useState(false);

  function formatTimestamp(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${month} ${day},${year} ${hours}:${minutes} ${ampm}`;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refresh) await refresh();
      setRefreshTime(formatTimestamp(new Date()));
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const titleMap = {
    dashboard: 'Construction Project Monitoring Dashboard',
    projects: 'Projects Overview',
    project_details: 'Project Deep Dive',
    equipment: 'Equipment & Fleet Telemetry',
    manpower: 'Workforce & Deployment',
    safety: 'Safety & Risk Compliance',
    alerts: 'Central Alerts & Incidents',
    analytics: 'Analytics & Performance Reports',
    settings: 'System Configuration',
  };

  const criticalCount = data?.stats?.criticalAlertsCount || 0;

  return (
    <header className="app-header">
      <div className="header-title">
        <h2>{titleMap[activeTab] || 'Construction Project Monitoring Dashboard'}</h2>
      </div>

      <div className="header-actions">
        {/* Real-time telemetry status */}
        <div
          className="live-badge"
          title={isSocketConnected ? 'Live IoT Stream Connected' : 'Connecting to Telemetry Hub...'}
        >
          <div
            className="live-dot"
            style={{ backgroundColor: isSocketConnected ? 'var(--color-success)' : 'var(--color-warning)' }}
          />
          <span>{isSocketConnected ? 'Telemetry Live' : 'Simulated Stream'}</span>
        </div>

        {/* Refresh timestamp per design.md */}
        <span className="header-refresh-timestamp">
          Data refreshed at {refreshTime}
        </span>

        {/* Refresh Button */}
        <button
          className="header-btn"
          onClick={handleRefresh}
          title="Refresh Dashboard Data"
          aria-label="Refresh Dashboard Data"
          disabled={isRefreshing}
          style={{ transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>

        {/* Overflow Action Button */}
        <button
          className="header-btn"
          title="More actions"
          aria-label="More actions"
          onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          style={{ position: 'relative' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
          {criticalCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-danger)',
                color: '#ffffff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                border: '2px solid #ffffff',
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
