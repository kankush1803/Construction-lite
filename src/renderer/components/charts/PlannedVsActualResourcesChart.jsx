import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function PlannedVsActualResourcesChart({ data: propData = null, title = 'Actual vs. Planned Resources - Top 5 Projects' }) {
  const defaultData = [
    { name: 'Skyline', planned: 215, actual: 270 },
    { name: 'Riverfront', planned: 210, actual: 255 },
    { name: 'Greenwood', planned: 285, actual: 335 },
    { name: 'Oakwood', planned: 160, actual: 260 },
    { name: 'WaterLine', planned: 265, actual: 305 },
  ];

  const data = propData && propData.length > 0 ? propData : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label} Resource Allocation</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="custom-chart-tooltip-item">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '2px', backgroundColor: entry.color }}></span>
              <span>{entry.name}:</span>
              <strong>{entry.value} personnel</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card" style={{ height: '315px' }}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
      </div>

      <div style={{ width: '100%', height: '245px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
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
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '6px' }}
            />
            <Bar
              dataKey="planned"
              name="Planned Resources"
              fill="#5CB5A4"
              radius={[4, 4, 0, 0]}
              barSize={36}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Resources"
              stroke="#286F8D"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#286F8D' }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
