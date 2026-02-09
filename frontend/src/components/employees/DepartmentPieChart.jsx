import React from 'react';
import { Typography, theme } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const { Title } = Typography;

const data = [
    { name: 'Engineering', value: 45 },
    { name: 'Design', value: 25 },
    { name: 'Marketing', value: 20 },
    { name: 'HR', value: 10 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'];

const DepartmentPieChart = () => {
    const { token } = theme.useToken();

    return (
        <div className="glass-card" style={{ padding: 24, height: 350 }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-primary)' }}>Department Distribution</Title>
            <div style={{ width: '100%', height: '85%', minWidth: 0 }}>
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
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DepartmentPieChart;
