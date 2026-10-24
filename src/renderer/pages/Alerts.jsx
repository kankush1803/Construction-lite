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

  const filtered = alerts.filter((a) => (filterSeverity === 'ALL' ? true : a.severity === filterSeverity));

  const columns = [
    {
      key: 'severity',
      header: 'Severity',
      render: (val) => (
        <span
          style={{
            fontWeight: 700,
            color:
              val === 'Critical'
                ? 'var(--accent-rose)'
                : val === 'Warning'
                ? 'var(--accent-amber)'
                : 'var(--accent-cyan)',
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'type', header: 'Type' },
    { key: 'message', header: 'Incident Description' },
    {
      key: 'created_at',
      header: 'Reported At',
      render: (val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (_, row) =>
        row.status === 'Open' ? (
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            onClick={(e) => {
              e.stopPropagation();
              handleAcknowledge(row.id);
            }}
          >
            Acknowledge
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acknowledged</span>
        ),
    },
  ];

  if (loading) return <Loading message="Loading system incident center..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Central Alerts & Incidents</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time feed of IoT anomaly detections and safety alarms
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'Critical', 'Warning', 'Info'].map((sev) => (
            <button
              key={sev}
              className={`btn ${filterSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
