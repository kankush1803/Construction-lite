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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const { latestTelemetry } = useDashboard();

  useEffect(() => {
    equipmentService.getAll().then((data) => {
      setEquipment(data || []);
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

  const filtered = equipment.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.serial_number.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'serial_number', header: 'Serial No.' },
    { key: 'name', header: 'Equipment Name' },
    { key: 'type', header: 'Type' },
    {
      key: 'health_score',
      header: 'Health Score',
      render: (val) => (
        <span style={{ color: val > 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 600 }}>
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

  if (loading) return <Loading message="Loading equipment telematics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Fleet & IoT Machinery</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time telemetry, engine health, and maintenance status
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search equipment..." />
      </div>

      <DataTable columns={columns} data={filtered} onRowClick={(row) => setSelectedItem(row)} />

      {/* Equipment Details Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.name || 'Equipment'}>
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Serial:</strong> {selectedItem.serial_number}</div>
            <div><strong>Type:</strong> {selectedItem.type}</div>
            <div><strong>Status:</strong> <StatusBadge status={selectedItem.status} /></div>
            <div><strong>Hours Operated:</strong> {selectedItem.hours_operated} hrs</div>
            <div><strong>Location:</strong> {selectedItem.location}</div>
            <div><strong>Last Maintenance:</strong> {selectedItem.last_maintenance || 'N/A'}</div>
            {selectedItem.lastReading && (
              <div style={{ backgroundColor: 'var(--bg-surface-hover)', padding: '0.5rem', borderRadius: '4px' }}>
                <strong>Latest IoT Packet:</strong> {selectedItem.lastReading}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
