import React from 'react';
import { Card, Typography, Progress, theme, Tag, Space } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const { Title, Text } = Typography;

const data = [
    { name: 'Work-Life', value: 85, color: '#10b981' },
    { name: 'Management', value: 72, color: '#3b82f6' },
    { name: 'Growth', value: 65, color: '#f59e0b' },
    { name: 'Culture', value: 90, color: '#8b5cf6' },
];

const PulseSurveys = () => {
    const { token } = theme.useToken();

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Pulse Survey Analytics</Title>
                <Tag color="success" icon={<RiseOutlined />}>+5% vs last month</Tag>
            </div>

            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <Text style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: 8 }}>Overall Sentiment</Text>
                <div className="flex-center" style={{ gap: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                        <SmileOutlined style={{ fontSize: 32, color: token.colorSuccess, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>78%</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Positive</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: 'var(--border-color)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <MehOutlined style={{ fontSize: 32, color: token.colorWarning, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>15%</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Neutral</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: 'var(--border-color)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <FrownOutlined style={{ fontSize: 32, color: token.colorError, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>7%</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Negative</div>
                    </div>
                </div>
            </div>

            <div style={{ height: 250, width: '100%' }}>
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
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
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

export default PulseSurveys;
