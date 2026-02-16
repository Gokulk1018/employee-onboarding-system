import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, Typography, theme } from 'antd';

const RecruitmentFunnel = () => {
    const { token } = theme.useToken();

    const data = [
        { name: 'Applied', value: 320, color: token.colorPrimary },
        { name: 'Screening', value: 180, color: token.colorInfo },
        { name: 'Interview', value: 85, color: token.colorWarning },
        { name: 'Offer', value: 24, color: token.colorSuccess },
        { name: 'Hired', value: 18, color: token.colorSuccessActive }, // Darker green or similar
    ];

    return (
        <div className="glass-card" style={{ padding: 24, borderColor: token.colorBorder }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Recruitment Funnel</Typography.Title>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: token.colorTextSecondary }}
                            width={80}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                borderRadius: 12,
                                border: `1px solid ${token.colorBorder}`,
                                boxShadow: token.boxShadow,
                                background: token.colorBgContainer,
                                color: token.colorText
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
