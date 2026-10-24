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

  useEffect(() => {
    Promise.all([manpowerService.getAll(), manpowerService.getSummary()]).then(([list, sum]) => {
      setWorkers(list || []);
      setSummary(sum);
      setLoading(false);
    });
  }, []);

  const filtered = workers.filter((w) =>
    w.full_name.toLowerCase().includes(search.toLowerCase()) ||
    w.trade.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'full_name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'trade', header: 'Trade' },
    { key: 'shift', header: 'Shift' },
    {
      key: 'safety_certified',
      header: 'Safety Certified',
      render: (val) => (val ? '✅ Yes' : '⚠️ Pending'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  if (loading) return <Loading message="Loading workforce roster..." />;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="widget-card">
          <h3 className="widget-title" style={{ marginBottom: '1rem' }}>Shift Attendance</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {summary?.onSite || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active On Site</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                {summary?.onBreak || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>On Break</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {summary?.offSite || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Off Site</div>
            </div>
          </div>
        </div>
        <ManpowerChart trades={summary?.trades} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Workforce Personnel</h3>
        <SearchBar value={search} onChange={setSearch} placeholder="Search workforce by name or trade..." />
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
