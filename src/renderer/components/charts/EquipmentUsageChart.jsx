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

export default function EquipmentUsageChart({ data = [], title = "Fleet Operating vs Idle Hours (Weekly)" }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Excavators', operating: 38, idle: 6 },
    { name: 'Cranes', operating: 45, idle: 3 },
    { name: 'Bulldozers', operating: 22, idle: 12 },
    { name: 'Dump Trucks', operating: 52, idle: 8 },
    { name: 'Mixers', operating: 31, idle: 4 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label} Fleet Hours</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="custom-chart-tooltip-item">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '2px', backgroundColor: entry.color }}></span>
              <span>{entry.name}:</span>
              <strong>{entry.value} hrs</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card" style={{ height: '320px' }}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" vertical={false} />
            <XAxis dataKey="name" stroke="#879197" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E7EA' }} />
            <YAxis stroke="#879197" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '8px' }} />
            <Bar dataKey="operating" name="Operating Hours" fill="#5CB5A4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="idle" name="Idle / Standby" fill="#A8A4E8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
