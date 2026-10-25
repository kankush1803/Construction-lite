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

export default function ProjectProgressChart({ data = [], title = "Cumulative Progress Curve (S-Curve)" }) {
  const chartData = data.length > 0 ? data : [
    { month: 'May', planned: 20, actual: 18 },
    { month: 'Jun', planned: 35, actual: 34 },
    { month: 'Jul', planned: 48, actual: 49 },
    { month: 'Aug', planned: 60, actual: 58 },
    { month: 'Sep', planned: 72, actual: 74 },
    { month: 'Oct', planned: 85, actual: 86 },
  ];

  const xKey = chartData[0]?.month !== undefined ? 'month' : (chartData[0]?.period !== undefined ? 'period' : 'label');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label} Progress</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="custom-chart-tooltip-item">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }}></span>
              <span>{entry.name}:</span>
              <strong>{entry.value}%</strong>
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
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" vertical={false} />
            <XAxis dataKey={xKey} stroke="#879197" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E7EA' }} />
            <YAxis stroke="#879197" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '8px' }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Progress %"
              stroke="#4BA8CC"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#4BA8CC' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="planned"
              name="Planned Baseline %"
              stroke="#A8A4E8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#A8A4E8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
