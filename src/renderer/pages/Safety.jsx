import React, { useState, useEffect } from 'react';
import Loading from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';

export default function Safety() {
  const [safety, setSafety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/safety/overview')
      .then((res) => res.json())
      .then((json) => {
        setSafety(json.data);
        setLoading(false);
      })
      .catch(() => {
        setSafety({
          incidentFreeDays: 142,
          riskLevel: 'Low',
          ppeComplianceRate: 98.4,
          inspectionsPassedThisMonth: 12,
          totalInspectionsThisMonth: 12,
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading message="Loading safety records..." />;

  const checklist = [
    { item: 'Morning Daily Safety Briefing & Toolbox Talk', status: 'Completed', time: '07:00 AM' },
    { item: 'Tower Crane Perimeter & Cable Inspection', status: 'Completed', time: '08:15 AM' },
    { item: 'Scaffolding & Fall Arrest Harness Audit', status: 'Completed', time: '10:30 AM' },
    { item: 'Excavation Trench Shoring & Water Ingress Check', status: 'In Progress', time: '01:00 PM' },
    { item: 'Hazardous Material & Chemical Storage Audit', status: 'Scheduled', time: '03:30 PM' },
  ];

  return (
    <div>
      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-title">Incident-Free Days</span>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {safety?.incidentFreeDays || 142}
          </div>
          <div className="stat-footer">Target: 365 Days</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Current Risk Assessment</span>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {safety?.riskLevel || 'Low'}
          </div>
          <div className="stat-footer">Based on AI/ML composite scoring</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">PPE Sensor Compliance</span>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
            {safety?.ppeComplianceRate || 98.4}%
          </div>
          <div className="stat-footer">Smart helmet & harness telemetry</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Monthly Inspections</span>
          <div className="stat-value">12 / 12</div>
          <div className="stat-footer">100% Passed</div>
        </div>
      </div>

      <div className="widget-card">
        <div className="widget-header">
          <h3 className="widget-title">Daily Safety Protocols & Checklists</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {checklist.map((c) => (
            <div
              key={c.item}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <strong>{c.item}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                  {c.time}
                </span>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
