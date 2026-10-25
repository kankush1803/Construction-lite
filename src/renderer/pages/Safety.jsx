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

  if (loading) return <Loading message="Loading site safety and environmental compliance..." />;

  const checklist = [
    { item: 'Morning Daily Safety Briefing & Toolbox Talk', status: 'Completed', time: '07:00 AM', inspector: 'Marcus Vance' },
    { item: 'Tower Crane Perimeter & Cable Inspection', status: 'Completed', time: '08:15 AM', inspector: 'Elena Rostova' },
    { item: 'Scaffolding & Fall Arrest Harness Audit', status: 'Completed', time: '10:30 AM', inspector: 'Amina Diallo' },
    { item: 'Excavation Trench Shoring & Water Ingress Check', status: 'In Progress', time: '01:00 PM', inspector: 'Carlos Mendez' },
    { item: 'Hazardous Chemical & Fuel Storage Containment', status: 'Scheduled', time: '03:30 PM', inspector: 'Amina Diallo' },
  ];

  const incidents = [
    { id: 1, type: 'Environmental', severity: 'Warning', description: 'Wind gusts exceeding 35 km/h at Tower Crane 01 elevation. High-altitude lifts paused.', time: 'Today, 11:20 AM', status: 'Acknowledged' },
    { id: 2, type: 'Machinery Anomaly', severity: 'Critical', description: 'Excessive vibration detected on CAT 950M bearing. Mandatory lockout initiated.', time: 'Today, 09:14 AM', status: 'Open' },
    { id: 3, type: 'PPE Telemetry', severity: 'Info', description: 'Worker smart helmet beacon re-paired at Gate 4 after low battery notification.', time: 'Yesterday, 04:45 PM', status: 'Resolved' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Safety KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Incident-Free Days</span>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
            {safety?.incidentFreeDays || 142}
          </div>
          <span className="kpi-subtext">Zero lost-time injuries record</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">AI Risk Assessment</span>
          <div className="kpi-value" style={{ color: safety?.riskLevel === 'Low' ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {safety?.riskLevel || 'Low'} Risk
          </div>
          <span className="kpi-subtext">Automated ML composite scoring</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">PPE Sensor Compliance</span>
          <div className="kpi-value" style={{ color: 'var(--color-primary-dark)' }}>
            {safety?.ppeComplianceRate || 98.4}%
          </div>
          <span className="kpi-subtext">Smart helmet & harness RFID checks</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Audits Passed</span>
          <div className="kpi-value">
            {safety?.inspectionsPassedThisMonth || 12} / {safety?.totalInspectionsThisMonth || 12}
          </div>
          <span className="kpi-subtext">100% regulatory compliance</span>
        </div>
      </div>

      {/* Protocols & Daily Checklists */}
      <div className="card-shell">
        <div className="widget-header">
          <h3 className="widget-title">Mandatory Safety Protocols & Field Audits</h3>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Shift Schedule: Standard Day Shift</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checklist.map((c) => (
            <div
              key={c.item}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-button)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--color-text)' }}>{c.item}</strong>
                <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Scheduled: {c.time} • Inspector: {c.inspector}
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents and Safety Log */}
      <div className="card-shell">
        <div className="widget-header">
          <h3 className="widget-title">Active Site Observations & Incident Log</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-button)',
                borderLeft: `4px solid ${
                  inc.severity === 'Critical'
                    ? 'var(--color-danger)'
                    : inc.severity === 'Warning'
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
                      inc.severity === 'Critical'
                        ? 'var(--color-danger)'
                        : inc.severity === 'Warning'
                        ? 'var(--color-warning)'
                        : 'var(--color-primary-dark)',
                  }}
                >
                  {inc.severity} • {inc.type}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>{inc.time}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.4 }}>
                {inc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
