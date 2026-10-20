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

export default function ProductivityChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', planned: 85, actual: 88 },
    { day: 'Tue', planned: 85, actual: 82 },
    { day: 'Wed', planned: 88, actual: 91 },
    { day: 'Thu', planned: 90, actual: 89 },
    { day: 'Fri', planned: 90, actual: 94 },
    { day: 'Sat', planned: 75, actual: 78 },
  ];

  return (
    <div className="widget-card" style={{ height: '340px' }}>
      <div className="widget-header">
        <h3 className="widget-title">Workforce Productivity Trend (% Target)</h3>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={[60, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="actual" name="Actual Productivity" stroke="#f59e0b" fillOpacity={1} fill="url(#actualGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="planned" name="Planned Target" stroke="#06b6d4" fillOpacity={1} fill="url(#plannedGrad)" strokeWidth={2} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
