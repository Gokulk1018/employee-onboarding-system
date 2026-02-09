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
            variant="borderless"
            style={{ borderRadius: 20, height: '100%' }}
        >
            <div style={{ width: '100%', height: 250, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={token.colorPrimary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={token.colorPrimary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorSplit} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: token.colorTextSecondary }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: token.colorTextSecondary }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: token.boxShadow, backgroundColor: token.colorBgContainer, color: token.colorText }}
                            cursor={{ stroke: token.colorPrimary, strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="hired" stroke={token.colorPrimary} strokeWidth={3} fillOpacity={1} fill="url(#colorHired)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default HiringChart;
