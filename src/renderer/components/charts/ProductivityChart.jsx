import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ProductivityChart({ data = [], title = "Workforce Productivity Trend (% Target)" }) {
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', planned: 85, actual: 88 },
    { day: 'Tue', planned: 85, actual: 82 },
    { day: 'Wed', planned: 88, actual: 91 },
    { day: 'Thu', planned: 90, actual: 89 },
    { day: 'Fri', planned: 90, actual: 94 },
    { day: 'Sat', planned: 75, actual: 78 },
  ];

  const xKey = chartData[0]?.day !== undefined ? 'day' : (chartData[0]?.period !== undefined ? 'period' : 'label');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label}</div>
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
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualProductivityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4BA8CC" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4BA8CC" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="plannedProductivityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5CB5A4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#5CB5A4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" vertical={false} />
            <XAxis dataKey={xKey} stroke="#879197" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E7EA' }} />
            <YAxis stroke="#879197" fontSize={11} domain={[60, 100]} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '8px' }} />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Productivity"
              stroke="#4BA8CC"
              fillOpacity={1}
              fill="url(#actualProductivityGrad)"
              strokeWidth={2.2}
            />
            <Area
              type="monotone"
              dataKey="planned"
              name="Planned Target"
              stroke="#5CB5A4"
              fillOpacity={1}
              fill="url(#plannedProductivityGrad)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
