import React from 'react';
import { Card, theme } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 75 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 76 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 85 },
    { month: 'Aug', score: 83 },
    { month: 'Sep', score: 87 },
    { month: 'Oct', score: 89 },
    { month: 'Nov', score: 91 },
    { month: 'Dec', score: 88 }
];

const EngagementTrendChart = () => {
    const { token } = theme.useToken();

    return (
        <Card
            title="Engagement Trend (2023)"
            bordered={false}
            className="glass-card"
        >
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorder} />
                        <XAxis
                            dataKey="month"
                            stroke={token.colorTextSecondary}
                            tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                        />
                        <YAxis
                            stroke={token.colorTextSecondary}
                            tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                            domain={[60, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: `1px solid ${token.colorBorder}`,
                                boxShadow: token.boxShadow,
                                background: token.colorBgContainer,
                            }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div style={{
                                            padding: '8px 12px',
                                            borderRadius: 12,
                                            border: `1px solid ${token.colorBorder}`,
                                            boxShadow: token.boxShadow,
                                            background: token.colorBgContainer,
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                marginBottom: 4,
                                                color: token.colorText,
                                                fontSize: 13
                                            }}>
                                                {payload[0].payload.month}
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                color: '#F9FAFB',
                                                fontWeight: 600,
                                                fontSize: 14
                                            }}>
                                                Score: {payload[0].value}%
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke={token.colorPrimary}
                            strokeWidth={3}
                            dot={{ fill: token.colorPrimary, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default EngagementTrendChart;
