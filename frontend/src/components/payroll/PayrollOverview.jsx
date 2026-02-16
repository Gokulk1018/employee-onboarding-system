import React from 'react';
import { Row, Col, theme } from 'antd';
import { DollarOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';

import axios from 'axios';

const PayrollOverview = ({ year, employeeId }) => {
    const { token } = theme.useToken();
    const [data, setData] = React.useState({
        monthlyNet: 0,
        totalEarnings: 0,
        totalTax: 0,
        salaryTrend: []
    });
    const [loading, setLoading] = React.useState(true);
    const [displayYear, setDisplayYear] = React.useState(year);
    const [comparison, setComparison] = React.useState(null);

    const fetchDashboardData = React.useCallback(async (targetYear) => {
        try {
            setLoading(true);
            setComparison(null);
            const res = await axios.get(`http://localhost:5000/api/payroll/dashboard/${employeeId}?year=${targetYear}`);

            let finalData = res.data;
            let finalYear = targetYear;

            // Fallback logic
            if (res.data.salaryTrend.length === 0 && targetYear > 2023) {
                let foundYear = null;
                for (let y = targetYear - 1; y >= 2024; y--) {
                    const checkRes = await axios.get(`http://localhost:5000/api/payroll/dashboard/${employeeId}?year=${y}`);
                    if (checkRes.data.salaryTrend.length > 0) {
                        finalData = checkRes.data;
                        finalYear = y;
                        foundYear = y;
                        break;
                    }
                }
                if (!foundYear) {
                    finalData = res.data;
                    finalYear = targetYear;
                }
            } else {
                finalData = res.data;
                finalYear = targetYear;
            }

            setData(finalData);
            setDisplayYear(finalYear);

            // Fetch Comparison if data exists
            if (finalData.salaryTrend && finalData.salaryTrend.length > 0) {
                // Get latest month from trend
                const latestEntry = finalData.salaryTrend[finalData.salaryTrend.length - 1];
                if (latestEntry) {
                    try {
                        const compRes = await axios.get(`http://localhost:5000/api/payroll/compare/${employeeId}/${latestEntry.year}/${latestEntry.month}`);
                        if (compRes.data.hasPrevious) {
                            let trendVal = parseFloat(compRes.data.percentChange);
                            if (compRes.data.direction === 'down') trendVal = -trendVal;
                            if (compRes.data.direction === 'same') trendVal = 0;
                            setComparison(trendVal);
                        }
                    } catch (err) {
                        console.error("Failed to fetch comparison", err);
                    }
                }
            }

        } catch (err) {
            console.error('Failed to fetch payroll dashboard', err);
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    React.useEffect(() => {
        fetchDashboardData(year);
    }, [year, fetchDashboardData]);

    const { monthlyNet, totalEarnings, totalTax, salaryTrend } = data;

    return (
        <div style={{ width: '100%', minHeight: '100%' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Monthly Net"
                        value={monthlyNet}
                        prefix="$"
                        icon={<DollarOutlined />}
                        color={token.colorSuccess}
                        loading={loading}
                        trend={comparison}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Earnings"
                        value={totalEarnings}
                        prefix="$"
                        icon={<BankOutlined />}
                        color={token.colorPrimary}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Tax"
                        value={totalTax}
                        prefix="$"
                        icon={<SafetyCertificateOutlined />}
                        color={token.colorWarning}
                        loading={loading}
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
                        Salary Growth Trend {displayYear}
                    </div>
                </div>

                <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                    {salaryTrend.length === 0 && !loading ? (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: token.colorTextSecondary,
                            fontSize: 14,
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: 12
                        }}>
                            No payroll data for selected year
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                    dataKey="month"
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
                                                        {label} {displayYear}
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
                                    dataKey="net"
                                    radius={[6, 6, 0, 0]}
                                    barSize={24}
                                    animationDuration={1000}
                                >
                                    {salaryTrend.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="url(#barGradient)"
                                            fillOpacity={index === salaryTrend.length - 1 ? 1 : 0.7}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PayrollOverview;
