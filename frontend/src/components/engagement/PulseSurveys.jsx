import React from 'react';
import { Card, Typography, Progress, theme, Tag, Space } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CountUp from '../common/CountUp';

const { Title, Text } = Typography;



const PulseSurveys = () => {
    const { token } = theme.useToken();

    const data = [
        { name: 'Work-Life', value: 85, color: token.colorSuccess },
        { name: 'Management', value: 72, color: token.colorInfo },
        { name: 'Growth', value: 65, color: token.colorWarning },
        { name: 'Culture', value: 90, color: token.colorPrimary }, // Using primary for purple if close
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Pulse Survey Analytics</Title>
                <Tag color="success" icon={<RiseOutlined />}>+5% vs last month</Tag>
            </div>

            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <Text style={{ display: 'block', color: token.colorTextSecondary, marginBottom: 8 }}>Overall Sentiment</Text>
                <div className="flex-center" style={{ gap: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                        <SmileOutlined style={{ fontSize: 32, color: token.colorSuccess, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>
                            <CountUp value={78} suffix="%" />
                        </div>
                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>Positive</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: token.colorBorder }} />
                    <div style={{ textAlign: 'center' }}>
                        <MehOutlined style={{ fontSize: 32, color: token.colorWarning, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>
                            <CountUp value={15} suffix="%" />
                        </div>
                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>Neutral</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: token.colorBorder }} />
                    <div style={{ textAlign: 'center' }}>
                        <FrownOutlined style={{ fontSize: 32, color: token.colorError, marginBottom: 4 }} />
                        <div style={{ fontWeight: 600 }}>
                            <CountUp value={7} suffix="%" />
                        </div>
                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>Negative</div>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: 250, minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
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
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }} // Keep transparent fill
                            contentStyle={{
                                borderRadius: 12,
                                border: `1px solid ${token.colorBorder}`,
                                boxShadow: token.boxShadow,
                                background: token.colorBgContainer,
                                color: token.colorText
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
