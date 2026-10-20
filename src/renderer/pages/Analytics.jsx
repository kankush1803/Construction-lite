import React from 'react';
import ProductivityChart from '../components/charts/ProductivityChart';
import EquipmentUsageChart from '../components/charts/EquipmentUsageChart';
import ProjectProgressChart from '../components/charts/ProjectProgressChart';
import ManpowerChart from '../components/charts/ManpowerChart';

export default function Analytics() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Analytics & Project Performance Reports</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Historical telemetry, Overall Equipment Effectiveness (OEE), and ML productivity analytics
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ProductivityChart />
        <EquipmentUsageChart />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <ProjectProgressChart />
        <ManpowerChart />
      </div>
    </div>
  );
}
