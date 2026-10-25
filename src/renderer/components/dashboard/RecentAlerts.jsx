import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function RecentAlerts({ alerts = [], onAcknowledge }) {
  return (
    <div className="card-shell">
      <div className="widget-header">
        <h3 className="widget-title">Recent Alerts & Anomalies</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No active alerts detected.</p>
        ) : (
          alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-button)',
                borderLeft: `4px solid ${
                  alert.severity === 'Critical'
                    ? 'var(--color-danger)'
                    : alert.severity === 'Warning'
                    ? 'var(--color-warning)'
                    : 'var(--color-primary-dark)'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
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
                <StatusBadge status={alert.status} />
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text)', lineHeight: 1.35, marginBottom: '6px' }}>
                {alert.message}
              </p>
              {alert.status === 'Open' && onAcknowledge && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
                    onClick={() => onAcknowledge(alert.id)}
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
