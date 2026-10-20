import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function EquipmentUsageChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Excavators', operating: 38, idle: 6 },
    { name: 'Cranes', operating: 45, idle: 3 },
    { name: 'Bulldozers', operating: 22, idle: 12 },
    { name: 'Dump Trucks', operating: 52, idle: 8 },
    { name: 'Mixers', operating: 31, idle: 4 },
  ];

  return (
    <div className="widget-card" style={{ height: '340px' }}>
      <div className="widget-header">
        <h3 className="widget-title">Fleet Operating vs Idle Hours (Weekly)</h3>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="operating" name="Operating Hours" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="idle" name="Idle / Standby" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
