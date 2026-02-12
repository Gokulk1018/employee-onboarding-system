import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography, theme } from 'antd';

const DepartmentChart = () => {
    const { token } = theme.useToken();

    const data = [
        { name: 'Engineering', value: 45, color: '#4f46e5' },
        { name: 'Product', value: 25, color: '#3b82f6' },
        { name: 'Sales', value: 20, color: '#10b981' },
        { name: 'HR', value: 10, color: '#f59e0b' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Department Distribution</Typography.Title>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
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
