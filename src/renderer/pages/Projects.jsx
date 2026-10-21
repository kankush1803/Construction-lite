import React, { useState, useEffect } from 'react';
import { projectService } from '../services/project.service';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import { useDashboard } from '../hooks/useDashboard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { setSelectedProjectId, setActiveTab } = useDashboard();

  useEffect(() => {
    projectService.getAll().then((data) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'code', header: 'Project Code' },
    { key: 'name', header: 'Project Name' },
    { key: 'client', header: 'Client' },
    { key: 'location', header: 'Location' },
    {
      key: 'budget',
      header: 'Budget',
      render: (val) => `$${Number(val).toLocaleString()}`,
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{val}%</span>
          <div style={{ width: '60px', height: '6px', background: '#374151', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${val}%`, height: '100%', background: '#f59e0b' }} />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  if (loading) return <Loading message="Loading projects directory..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Projects</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Overview of ongoing and planned construction developments
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, code, client..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => {
          setSelectedProjectId(row.id);
          setActiveTab('project_details');
        }}
      />
    </div>
  );
}
