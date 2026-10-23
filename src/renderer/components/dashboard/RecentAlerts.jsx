import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function RecentAlerts({ alerts = [], onAcknowledge }) {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Recent Alerts & Anomalies</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active alerts detected.</p>
        ) : (
          alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${
                  alert.severity === 'Critical'
                    ? 'var(--accent-rose)'
                    : alert.severity === 'Warning'
                    ? 'var(--accent-amber)'
                    : 'var(--accent-cyan)'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {alert.severity} • {alert.type}
                </span>
                <StatusBadge status={alert.status} />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {alert.message}
              </p>
              {alert.status === 'Open' && onAcknowledge && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => onAcknowledge(alert.id)}
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
