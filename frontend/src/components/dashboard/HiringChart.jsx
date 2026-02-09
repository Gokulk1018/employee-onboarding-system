import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Typography, theme } from 'antd';

const data = [
    { name: 'Jan', hired: 4 },
    { name: 'Feb', hired: 3 },
    { name: 'Mar', hired: 6 },
    { name: 'Apr', hired: 8 },
    { name: 'May', hired: 12 },
    { name: 'Jun', hired: 9 },
    { name: 'Jul', hired: 15 },
];

const HiringChart = () => {
    const { token } = theme.useToken();
    return (
        <Card
            title={<Typography.Title level={4} style={{ margin: 0 }}>Hiring Trends</Typography.Title>}
            bordered={false}
            style={{ borderRadius: 20, height: '100%' }}
        >
            <div style={{ height: 250, width: '100%' }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: token.boxShadow }}
                            cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="hired" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorHired)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default HiringChart;
