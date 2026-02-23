import React from 'react';
import { Typography, theme, Empty, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];

const DepartmentPieChart = ({ data, loading }) => {
    const { token } = theme.useToken();

    if (loading) {
        return (
            <div className="glass-card flex-center" style={{ padding: 24, height: 400 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="glass-card flex-center" style={{ padding: 24, height: 400 }}>
                <Empty description="No data available" />
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ padding: 24, height: 400 }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-primary)' }}>Department Distribution</Title>
            <div style={{ width: '100%', height: '85%', minWidth: 0, minHeight: 0, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: '1px solid var(--border-color)',
                                boxShadow: token.boxShadow,
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            layout="horizontal"
                            iconType="circle"
                            wrapperStyle={{ paddingTop: 20 }}
                            formatter={(value) => <span style={{ color: token.colorTextSecondary, fontSize: 13 }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DepartmentPieChart;
