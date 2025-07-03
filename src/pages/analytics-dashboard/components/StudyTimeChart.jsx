import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudyTimeChart = ({ data, timeRange }) => {
  const formatTooltip = (value, name) => {
    if (name === 'hours') {
      return [`${value}h`, 'Study Hours'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    if (timeRange === 'week') {
      return tickItem.slice(0, 3); // Mon, Tue, etc.
    }
    if (timeRange === 'month') {
      return tickItem.slice(0, 6); // Week 1, etc.
    }
    return tickItem.slice(0, 8); // Jan 2024, etc.
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Study Time Trends</h3>
          <p className="text-sm text-text-secondary">Daily study hours over time</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickFormatter={formatXAxisLabel}
            />
            <YAxis 
              stroke="var(--color-text-muted)"
              fontSize={12}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: 'var(--color-text-primary)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudyTimeChart;