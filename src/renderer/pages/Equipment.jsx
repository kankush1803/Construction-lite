import React, { useState, useEffect } from 'react';
import { equipmentService } from '../services/equipment.service';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { useDashboard } from '../hooks/useDashboard';

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const { latestTelemetry } = useDashboard();

  useEffect(() => {
    Promise.all([equipmentService.getAll(), equipmentService.getSummary()]).then(([data, sum]) => {
      setEquipment(data || []);
      setSummary(sum);
      setLoading(false);
    });
  }, []);

  // Update telemetry value if live telemetry received
  useEffect(() => {
    if (latestTelemetry) {
      setEquipment((prev) =>
        prev.map((eq) => {
          if (eq.id === latestTelemetry.equipment_id) {
            return {
              ...eq,
              lastReading: `${latestTelemetry.sensor_type}: ${latestTelemetry.value} ${latestTelemetry.unit}`,
              status: latestTelemetry.status === 'Critical' ? 'Critical' : eq.status,
            };
          }
          return eq;
        })
      );
    }
  }, [latestTelemetry]);

  const filtered = equipment.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.serial_number.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = equipment.filter((e) => e.status === 'Active').length;
  const avgHealth = equipment.length
    ? (equipment.reduce((acc, e) => acc + (parseFloat(e.health_score) || 0), 0) / equipment.length).toFixed(1)
    : 92.4;
  const maintenanceCount = equipment.filter((e) => e.status === 'Maintenance').length;

  const columns = [
    {
      key: 'serial_number',
      header: 'Serial No.',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{val}</span>,
    },
    {
      key: 'name',
      header: 'Equipment Name',
      render: (val) => <strong style={{ color: 'var(--color-text)' }}>{val}</strong>,
    },
    { key: 'type', header: 'Category' },
    {
      key: 'health_score',
      header: 'Health Score',
      render: (val) => (
        <span
          style={{
            color: val > 80 ? 'var(--color-success)' : val > 65 ? 'var(--color-warning)' : 'var(--color-danger)',
            fontWeight: 700,
          }}
        >
          {val}/100
        </span>
      ),
    },
    {
      key: 'fuel_level',
      header: 'Fuel %',
      render: (val) => `${val}%`,
    },
    { key: 'location', header: 'Site Location' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  if (loading) return <Loading message="Loading fleet and telematics telemetry..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Fleet KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Total Fleet Units</span>
          <div className="kpi-value">{equipment.length}</div>
          <span className="kpi-subtext">Active machinery inventory</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Operating in Field</span>
          <div className="kpi-value">{activeCount}</div>
          <span className="kpi-subtext">{summary?.utilizationRate || 83}% fleet utilization</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Average Health Score</span>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>{avgHealth}/100</div>
          <span className="kpi-subtext">Predictive telemetry index</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Under Maintenance</span>
          <div className="kpi-value" style={{ color: maintenanceCount > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
            {maintenanceCount}
          </div>
          <span className="kpi-subtext">Scheduled inspection depot</span>
        </div>
      </div>

      {/* Control Bar: Search and Status Filter */}
      <div className="card-shell" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search equipment by name, serial, type..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status:</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> of {equipment.length} machinery units
        </span>
      </div>

      {/* Equipment Table */}
      <DataTable columns={columns} data={filtered} onRowClick={(row) => setSelectedItem(row)} />

      {/* Equipment Details Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.name || 'Equipment Telematics'}>
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Serial Number</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedItem.serial_number}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Category</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedItem.type}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Operational Status</span>
                <div style={{ marginTop: '4px' }}><StatusBadge status={selectedItem.status} /></div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Engine Health</span>
                <div style={{ fontWeight: 700, color: selectedItem.health_score > 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {selectedItem.health_score} / 100
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Total Operating Hours</span>
                <div style={{ fontWeight: 600 }}>{selectedItem.hours_operated} hrs</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Fuel Reserve</span>
                <div style={{ fontWeight: 600 }}>{selectedItem.fuel_level}%</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Current Geo-Zone / Sector</span>
                <div style={{ fontWeight: 600 }}>{selectedItem.location}</div>
              </div>
            </div>

            {selectedItem.lastReading && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-button)',
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Live IoT Sensor Packet
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginTop: '2px' }}>
                  {selectedItem.lastReading}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
