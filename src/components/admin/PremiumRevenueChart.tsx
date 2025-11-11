'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PremiumRevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}

export default function PremiumRevenueChart({ data }: PremiumRevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₺${value}`}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
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
          formatter={(value: number, name: string) => {
            if (name === 'Gelir') return [`₺${value}`, name];
            return [value, name];
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Bar 
          yAxisId="left"
          dataKey="revenue" 
          fill="#10b981" 
          name="Gelir"
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          yAxisId="right"
          dataKey="subscriptions" 
          fill="#3b82f6" 
          name="Abonelikler"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
