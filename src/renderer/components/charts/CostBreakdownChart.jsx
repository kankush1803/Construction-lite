import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CostBreakdownChart({ data: propData = null, title = 'Cost Breakdown' }) {
  const defaultData = [
    { name: 'Material', value: 162, percent: '21.1%', displayValue: '$162K', color: '#7774D6' },
    { name: 'Equipment', value: 160, percent: '20.9%', displayValue: '$160K', color: '#A8A4E8' },
    { name: 'Labor', value: 158, percent: '20.6%', displayValue: '$158K', color: '#D8D5F5' },
    { name: 'Subcontractors', value: 152, percent: '19.8%', displayValue: '$152K', color: '#5CB5A4' },
    { name: 'Foreign Labor', value: 135, percent: '17.6%', displayValue: '$135K', color: '#286F8D' },
  ];

  const data = propData && propData.length > 0 ? propData : defaultData;

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 14;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#667176"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
        fontWeight={500}
      >
        {data[index]?.percent || ''}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="custom-chart-tooltip">
          <div className="custom-chart-tooltip-title">{item.name}</div>
          <div className="custom-chart-tooltip-item">
            <span>Budget Allocation:</span>
            <strong>{item.payload.displayValue || `$${item.value}K`} ({item.payload.percent})</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
      </div>

      <div style={{ width: '100%', height: '170px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={{ stroke: '#879197', strokeWidth: 0.8 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table beneath the donut matching screenshot */}
      <table className="cost-breakdown-table">
        <tbody>
          {data.map((item) => (
            <tr key={item.name}>
              <td className="category-name" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, marginRight: 8 }}></span>
                {item.name}
              </td>
              <td
                className="category-amount"
                style={{
                  backgroundColor: `${item.color}22`,
                  color: 'var(--color-text)',
                }}
              >
                {item.displayValue || `$${item.value}K`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
