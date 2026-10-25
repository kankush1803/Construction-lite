import React from 'react';

export default function SafetyOverview({ safety }) {
  const s = safety || { incidentFreeDays: 0, riskLevel: 'Low', ppeComplianceRate: 100, activeSafetyAlerts: 0 };

  const riskColor =
    s.riskLevel === 'Low' ? 'var(--color-success)' : s.riskLevel === 'Moderate' ? 'var(--color-warning)' : 'var(--color-danger)';
  const riskBg =
    s.riskLevel === 'Low' ? 'rgba(47, 138, 104, 0.1)' : s.riskLevel === 'Moderate' ? 'rgba(197, 139, 43, 0.1)' : 'rgba(198, 83, 83, 0.1)';

  return (
    <div className="card-shell">
      <div className="widget-header">
        <h3 className="widget-title">Site Safety & Compliance</h3>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 650,
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: riskBg,
            color: riskColor,
            border: `1px solid ${riskColor}33`,
          }}
        >
          {s.riskLevel} Risk Level
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '12px', borderRadius: 'var(--radius-button)' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-success)' }}>
            {s.incidentFreeDays}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Incident-Free Days</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '12px', borderRadius: 'var(--radius-button)' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            {s.ppeComplianceRate}%
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>PPE Compliance Rate</div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        Active Safety Notices: <strong style={{ color: 'var(--color-text)' }}>{s.activeSafetyAlerts}</strong>
      </div>
    </div>
  );
}
