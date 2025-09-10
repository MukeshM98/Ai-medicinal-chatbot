import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimelineData, TimelineDataPoint } from '../types';

interface HealthTimelineChartProps {
  data: TimelineData;
}

const HealthTimelineChart: React.FC<HealthTimelineChartProps> = ({ data }) => {
  if (!data || !data.points || data.points.length === 0) {
    return <p className="text-slate-500">No timeline data available.</p>;
  }

  const { metric1_name, metric2_name, points } = data;

  const chartData: TimelineDataPoint[] = points.map(point => ({
    date: point.date,
    [metric1_name]: point.metric1_value,
    [metric2_name]: point.metric2_value,
  }));

  const line1_key = metric1_name || 'Metric 1';
  const line2_key = metric2_name || 'Metric 2';

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem'
            }} 
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }}/>
          <Line type="monotone" dataKey={line1_key} stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} name={line1_key} />
          <Line type="monotone" dataKey={line2_key} stroke="#10b981" strokeWidth={2} name={line2_key} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthTimelineChart;