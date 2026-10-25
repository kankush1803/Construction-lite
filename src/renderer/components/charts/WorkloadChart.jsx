import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function WorkloadChart({ data: propData = null, title = 'Workload - Top 5 Projects' }) {
  const defaultData = [
    { name: 'Skyline', completed: 220, remaining: 85, overdue: 35 },
    { name: 'Riverfront', completed: 200, remaining: 75, overdue: 30 },
    { name: 'Greenwood', completed: 200, remaining: 60, overdue: 0 },
    { name: 'Oakwood', completed: 195, remaining: 55, overdue: 0 },
    { name: 'MetroTower', completed: 190, remaining: 55, overdue: 0 },
  ];

  const data = propData && propData.length > 0 ? propData : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{label} Workload</div>
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
    <div className="chart-card" style={{ height: '275px' }}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
      </div>

      <div style={{ width: '100%', height: '210px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
            barCategoryGap={8}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#667176"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={82}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="square"
              wrapperStyle={{ fontSize: '11px', color: '#667176', paddingTop: '4px' }}
            />
            <Bar dataKey="completed" name="Completed" stackId="a" fill="#4BA8CC" radius={[0, 0, 0, 0]} />
            <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#8BC8DE" radius={[0, 0, 0, 0]} />
            <Bar dataKey="overdue" name="OverDue" stackId="a" fill="#B6DCED" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
