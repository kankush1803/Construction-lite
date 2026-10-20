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

export default function ProjectProgressChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { month: 'May', planned: 20, actual: 18 },
    { month: 'Jun', planned: 35, actual: 34 },
    { month: 'Jul', planned: 48, actual: 49 },
    { month: 'Aug', planned: 60, actual: 58 },
    { month: 'Sep', planned: 72, actual: 74 },
    { month: 'Oct', planned: 85, actual: 86 },
  ];

  return (
    <div className="widget-card" style={{ height: '340px' }}>
      <div className="widget-header">
        <h3 className="widget-title">Cumulative Progress Curve (S-Curve)</h3>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="actual" name="Actual Progress %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="planned" name="Planned Baseline %" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
