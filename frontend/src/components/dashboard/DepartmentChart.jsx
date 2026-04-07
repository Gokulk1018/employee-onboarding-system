import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography, theme, Skeleton } from 'antd';

const DepartmentChart = ({ data = [], loading }) => {
    const { token } = theme.useToken();

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
                <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Department Distribution</Typography.Title>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
                    <Skeleton.Avatar active size={200} shape="circle" />
                </div>
            </div>
        );
    }

    const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444'];

    const chartData = data.map((item, index) => ({
        name: item._id || 'Unassigned',
        value: item.count,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder, minHeight: 400 }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Department Distribution</Typography.Title>
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={300} debounce={50} minWidth={0}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: `1px solid ${token.colorBorder}`,
                                boxShadow: token.boxShadow,
                                background: token.colorBgContainer,
                                color: token.colorText
                            }}
                            itemStyle={{ color: token.colorText }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span style={{ color: token.colorTextSecondary }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DepartmentChart;
