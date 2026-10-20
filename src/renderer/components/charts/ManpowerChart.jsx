import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ManpowerChart({ trades = [] }) {
  const chartData = trades.length > 0 ? trades.map(t => ({ name: t.trade, value: t.count })) : [
    { name: 'Civil', value: 18 },
    { name: 'Mechanical', value: 12 },
    { name: 'Electrical', value: 8 },
    { name: 'Plumbing', value: 5 },
    { name: 'Safety', value: 3 },
  ];

  const COLORS = ['#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#f43f5e'];

  return (
    <div className="widget-card" style={{ height: '340px' }}>
      <div className="widget-header">
        <h3 className="widget-title">Workforce Trade Distribution</h3>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              itemStyle={{ color: '#f9fafb' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
