'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserGrowthChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const formattedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('tr-TR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
          formatter={(value: number) => [value.toLocaleString('tr-TR'), 'Toplam Kullanıcı']}
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#8b5cf6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
