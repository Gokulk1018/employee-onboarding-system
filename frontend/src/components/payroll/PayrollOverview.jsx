import React from 'react';
import { Row, Col, theme } from 'antd';
import { DollarOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Jan', value: 4500 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 4500 },
    { name: 'Apr', value: 4800 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 4800 },
    { name: 'Jul', value: 5000 },
    { name: 'Aug', value: 5000 },
    { name: 'Sep', value: 5000 },
    { name: 'Oct', value: 5000 },
];

const PayrollOverview = () => {
    const { token } = theme.useToken();git 
    return (
        <div>
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <StatCard title="Net Salary" value={5000} prefix="$" icon={<DollarOutlined />} color={token.colorSuccess} trend={0} />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="Total Earnings (YTD)" value={48900} prefix="$" icon={<BankOutlined />} color={token.colorPrimary} />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="Taxes Deducted (YTD)" value={12400} prefix="$" icon={<SafetyCertificateOutlined />} color={token.colorWarning} />
                </Col>
            </Row>

            <div className="glass-card" style={{ padding: 24, borderColor: token.colorBorder }}>
                <div style={{ marginBottom: 24, fontSize: 16, fontWeight: 600, color: token.colorText }}>Salary Trend</div>
                <div style={{ height: 300, width: '100%', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
                                                    {payload[0].payload.name}
                                                </p>
                                                <p style={{
                                                    margin: 0,
                                                    color: '#F9FAFB',
                                                    fontWeight: 600,
                                                    fontSize: 14
                                                }}>
                                                    Salary: ${payload[0].value}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32} animationDuration={1500} animationBegin={500}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? token.colorSuccess : token.colorPrimary} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PayrollOverview;
