import React from 'react';

export default function SafetyOverview({ safety }) {
  const s = safety || { incidentFreeDays: 0, riskLevel: 'Low', ppeComplianceRate: 100, activeSafetyAlerts: 0 };

  const riskColor =
    s.riskLevel === 'Low' ? 'var(--accent-emerald)' : s.riskLevel === 'Moderate' ? 'var(--accent-amber)' : 'var(--accent-rose)';

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Site Safety & Compliance</h3>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            color: riskColor,
            border: `1px solid ${riskColor}`,
          }}
        >
          {s.riskLevel} Risk
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {s.incidentFreeDays}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Incident-Free Days</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {s.ppeComplianceRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PPE Compliance Rate</div>
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Active Safety Notices: <strong style={{ color: 'var(--text-primary)' }}>{s.activeSafetyAlerts}</strong>
      </div>
    </div>
  );
}
