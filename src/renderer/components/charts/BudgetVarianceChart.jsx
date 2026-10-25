import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function BudgetVarianceChart({ data = [], title = 'Budget Variance - Top 5 Projects', unit = 'K' }) {
  const defaultData = [
    { name: 'Skyline', actual: 638, planned: 630 },
    { name: 'Riverfront', actual: 598, planned: 426 },
    { name: 'Greenwood', actual: 579, planned: 521 },
    { name: 'Oakwood', actual: 558, planned: 598 },
    { name: 'DT_Office', actual: 496, planned: 447 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="custom-chart-tooltip-item">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }}></span>
              <span>{entry.name}:</span>
              <strong>${entry.value}{unit}</strong>
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
          <LineChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#879197"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E7EA' }}
            />
            <YAxis
              stroke="#879197"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Budget"
              stroke="#4BA8CC"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#4BA8CC' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="planned"
              name="Planned Budget"
              stroke="#A8A4E8"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#A8A4E8' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
