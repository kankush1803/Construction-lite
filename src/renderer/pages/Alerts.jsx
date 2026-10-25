import React, { useState, useEffect } from 'react';
import { alertService } from '../services/alert.service';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import Loading from '../components/common/Loading';
import { useDashboard } from '../hooks/useDashboard';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const { latestAlert } = useDashboard();

  const loadAlerts = () => {
    alertService.getAll().then((data) => {
      setAlerts(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (latestAlert) {
      setAlerts((prev) => [latestAlert, ...prev.filter((a) => a.id !== latestAlert.id)]);
    }
  }, [latestAlert]);

  const handleAcknowledge = async (id) => {
    await alertService.acknowledge(id);
    loadAlerts();
  };

  const criticalCount = alerts.filter((a) => a.severity === 'Critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'Warning').length;
  const openCount = alerts.filter((a) => a.status === 'Open').length;

  const filtered = alerts.filter((a) => (filterSeverity === 'ALL' ? true : a.severity === filterSeverity));

  const columns = [
    {
      key: 'severity',
      header: 'Severity',
      render: (val) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: '11.5px',
            textTransform: 'uppercase',
            color:
              val === 'Critical'
                ? 'var(--color-danger)'
                : val === 'Warning'
                ? 'var(--color-warning)'
                : 'var(--color-primary-dark)',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Category',
      render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      key: 'message',
      header: 'Incident Description',
      render: (val) => <span style={{ color: 'var(--color-text)', lineHeight: 1.4 }}>{val}</span>,
    },
    {
      key: 'created_at',
      header: 'Logged At',
      render: (val) => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Resolution Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (_, row) =>
        row.status === 'Open' ? (
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11.5px', height: '28px', padding: '0 10px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleAcknowledge(row.id);
            }}
          >
            Acknowledge
          </button>
        ) : (
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Acknowledged</span>
        ),
    },
  ];

  if (loading) return <Loading message="Loading system incident center..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Incident Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Total Logged Incidents</span>
          <div className="kpi-value">{alerts.length}</div>
          <span className="kpi-subtext">Cumulative sensor anomalies</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Critical Alarms</span>
          <div className="kpi-value" style={{ color: criticalCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {criticalCount}
          </div>
          <span className="kpi-subtext">Immediate action required</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Warning Notifications</span>
          <div className="kpi-value" style={{ color: warningCount > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
            {warningCount}
          </div>
          <span className="kpi-subtext">Threshold warning events</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Pending Acknowledgement</span>
          <div className="kpi-value" style={{ color: openCount > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
            {openCount}
          </div>
          <span className="kpi-subtext">Awaiting operator sign-off</span>
        </div>
      </div>

      {/* Control Bar: Severity Filter */}
      <div className="card-shell" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Severity Filter:</span>
          <div className="btn-group">
            {['ALL', 'Critical', 'Warning', 'Info'].map((sev) => (
              <button
                key={sev}
                className={`btn ${filterSeverity === sev ? 'active' : ''}`}
                onClick={() => setFilterSeverity(sev)}
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> incidents
        </span>
      </div>

      {/* Alerts Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
