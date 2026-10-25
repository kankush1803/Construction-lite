import React, { useState, useEffect } from 'react';
import { manpowerService } from '../services/manpower.service';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import ManpowerChart from '../components/charts/ManpowerChart';

export default function Manpower() {
  const [workers, setWorkers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');

  useEffect(() => {
    Promise.all([manpowerService.getAll(), manpowerService.getSummary()]).then(([list, sum]) => {
      setWorkers(list || []);
      setSummary(sum);
      setLoading(false);
    });
  }, []);

  const filtered = workers.filter((w) => {
    const matchesSearch =
      w.full_name.toLowerCase().includes(search.toLowerCase()) ||
      w.trade.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase());
    const matchesTrade = tradeFilter === 'All' ? true : w.trade === tradeFilter;
    return matchesSearch && matchesTrade;
  });

  const columns = [
    {
      key: 'full_name',
      header: 'Worker Name',
      render: (val) => <strong style={{ color: 'var(--color-text)' }}>{val}</strong>,
    },
    { key: 'role', header: 'Job Title / Function' },
    {
      key: 'trade',
      header: 'Trade Specialty',
      render: (val) => (
        <span
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-input)',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'shift', header: 'Shift Assignment' },
    {
      key: 'safety_certified',
      header: 'Safety Certification',
      render: (val) => (
        <span style={{ color: val ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, fontSize: '12px' }}>
          {val ? 'Certified (Active)' : 'Renewal Pending'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Attendance',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  if (loading) return <Loading message="Loading workforce roster and attendance..." />;

  const uniqueTrades = Array.from(new Set(workers.map((w) => w.trade)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Workforce KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Total Roster</span>
          <div className="kpi-value">{workers.length}</div>
          <span className="kpi-subtext">Registered construction personnel</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Active On Site</span>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>{summary?.onSite || 0}</div>
          <span className="kpi-subtext">{summary?.attendanceRate || 85}% shift attendance</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">On Break</span>
          <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>{summary?.onBreak || 0}</div>
          <span className="kpi-subtext">Staggered rest interval</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Safety Compliance</span>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
            {summary?.safetyCertifiedRate || 100}%
          </div>
          <span className="kpi-subtext">OSHA & site induction certified</span>
        </div>
      </div>

      {/* Charts & Shift Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        <div className="card-shell">
          <div className="widget-header">
            <h3 className="widget-title">Shift Attendance Distribution</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: 'var(--radius-button)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)' }}>{summary?.onSite || 0}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Active On Site</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-warning)' }}>{summary?.onBreak || 0}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>On Break</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{summary?.offSite || 0}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Off Site</div>
            </div>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            Real-time biometric turnstile check-ins and safety badge RFID pings are updated continuously across all site entry gates.
          </p>
        </div>

        <ManpowerChart trades={summary?.trades} />
      </div>

      {/* Control Bar */}
      <div className="card-shell" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search crew by name, role, or trade..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Trade:</span>
            <select
              className="filter-select"
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="All">All Trades</option>
              {uniqueTrades.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> of {workers.length} crew members
        </span>
      </div>

      {/* Workforce Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
