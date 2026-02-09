import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, Typography, theme } from 'antd';

const RecruitmentFunnel = () => {
    const { token } = theme.useToken();

    const data = [
        { name: 'Applied', value: 320, color: '#3b82f6' },
        { name: 'Screening', value: 180, color: '#6366f1' },
        { name: 'Interview', value: 85, color: '#8b5cf6' },
        { name: 'Offer', value: 24, color: '#10b981' },
        { name: 'Hired', value: 18, color: '#059669' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Recruitment Funnel</Typography.Title>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            width={80}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                borderRadius: 12,
                                border: '1px solid var(--border-color)',
                                boxShadow: token.boxShadow,
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RecruitmentFunnel;
