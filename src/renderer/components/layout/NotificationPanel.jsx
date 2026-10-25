import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { alertService } from '../../services/alert.service';

export default function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen, data, refresh } = useDashboard();
  const alerts = data?.recentAlerts || [];

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledge(id);
      refresh();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <div className={`notification-panel ${notificationPanelOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--color-text)' }}>Incident & Telemetry Feed</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Real-time sensor alarms and risk events</p>
        </div>
        <button
          className="header-btn"
          style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
          onClick={() => setNotificationPanelOpen(false)}
          aria-label="Close notification panel"
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className="empty-state-title" style={{ fontSize: '13px' }}>No Active Incidents</span>
            <span className="empty-state-desc">All systems and machinery operating within normal thresholds.</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-button)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color:
                      alert.severity === 'Critical'
                        ? 'var(--color-danger)'
                        : alert.severity === 'Warning'
                        ? 'var(--color-warning)'
                        : 'var(--color-primary-dark)',
                  }}
                >
                  {alert.severity} • {alert.type}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {alert.status}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.4 }}>
                {alert.message}
              </p>
              {alert.status === 'Open' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '11.5px', height: '28px', padding: '0 10px' }}
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
