import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ManpowerChart({ trades = [], data, title = "Workforce Trade Distribution" }) {
  const inputList = (data && data.length > 0) ? data : trades;
  const chartData = inputList.length > 0 ? inputList.map(t => ({
    name: t.name || t.trade,
    value: t.value !== undefined ? t.value : (t.count || 0)
  })) : [
    { name: 'Civil', value: 18 },
    { name: 'Mechanical', value: 12 },
    { name: 'Electrical', value: 8 },
    { name: 'Plumbing', value: 5 },
    { name: 'Safety', value: 3 },
  ];

  // Palette from design.md: primary, teal, lavender, purple, primary-dark
  const COLORS = ['#4BA8CC', '#5CB5A4', '#A8A4E8', '#7774D6', '#286F8D', '#F48847', '#E55C5C'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{item.name} Workforce</div>
          <div className="custom-chart-tooltip-item">
            <span>Personnel:</span>
            <strong>{item.value} crew members</strong>
          </div>
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
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#667176' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
