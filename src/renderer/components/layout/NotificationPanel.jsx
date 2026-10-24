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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Incident Feed</h3>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
          onClick={() => setNotificationPanelOpen(false)}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent alerts.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color:
                      alert.severity === 'Critical'
                        ? 'var(--accent-rose)'
                        : alert.severity === 'Warning'
                        ? 'var(--accent-amber)'
                        : 'var(--accent-cyan)',
                  }}
                >
                  {alert.severity} • {alert.type}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {alert.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {alert.message}
              </p>
              {alert.status === 'Open' && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => handleAcknowledge(alert.id)}
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
