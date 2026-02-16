import React from 'react';
import { Row, Col, theme } from 'antd';
import { DollarOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';

const getYearlyData = (year) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseValue = 4500;

    const multipliers = {
        '2024': 0.9,
        '2025': 1.0,
        '2026': 1.15
    };

    const multiplier = multipliers[year] || 1.0;

    return months.map((month, index) => ({
        name: month,
        value: Math.round((baseValue + (index * 150)) * multiplier)
    }));
};

const PayrollOverview = ({ year }) => {
    const { token } = theme.useToken();
    const data = getYearlyData(year);

    const netSalary = data[data.length - 1].value;
    const totalEarnings = data.reduce((acc, curr) => acc + curr.value, 0);
    const taxesDeducted = Math.round(totalEarnings * 0.22);

    return (
        <div style={{ width: '100%', minHeight: '100%' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Monthly Net"
                        value={netSalary}
                        prefix="$"
                        icon={<DollarOutlined />}
                        color={token.colorSuccess}
                        trend={year === '2026' ? 15 : (year === '2024' ? -10 : 0)}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Earnings"
                        value={totalEarnings}
                        prefix="$"
                        icon={<BankOutlined />}
                        color={token.colorPrimary}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Tax"
                        value={taxesDeducted}
                        prefix="$"
                        icon={<SafetyCertificateOutlined />}
                        color={token.colorWarning}
                    />
                </Col>
            </Row>

            <motion.div
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="glass-card"
                style={{
                    padding: '20px 24px',
                    borderColor: token.colorBorder,
                    overflow: 'hidden',
                    cursor: 'default',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: token.colorText, opacity: 0.9 }}>
                        Salary Growth Trend {year}
                    </div>
                </div>

                <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={token.colorPrimary} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={token.colorPrimary} stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: token.colorTextSecondary, fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 1000', 'dataMax + 500']}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{
                                    borderRadius: 12,
                                    border: `1px solid ${token.colorBorder}`,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    background: 'rgba(20, 20, 20, 0.9)',
                                    backdropFilter: 'blur(4px)',
                                    padding: '8px 12px'
                                }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div style={{ pointerEvents: 'none' }}>
                                                <div style={{ color: token.colorTextSecondary, fontSize: 11, marginBottom: 4 }}>
                                                    {label} {year}
                                                </div>
                                                <div style={{ color: token.colorText, fontWeight: 600, fontSize: 14 }}>
                                                    ${payload[0].value.toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[6, 6, 0, 0]}
                                barSize={24}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="url(#barGradient)"
                                        fillOpacity={index === data.length - 1 ? 1 : 0.7}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default PayrollOverview;
