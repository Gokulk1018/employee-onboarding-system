import React from 'react';
import { Row, Col, Statistic, Card, theme, Typography, Space } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircleOutlined, UserOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const FormAnalytics = ({ data, formType, formTitle }) => {
    const { token } = theme.useToken();

    // Premium color palette matching the requested donut chart look
    const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

    const chartData = data?.optionsCount ? Object.keys(data.optionsCount).map((key, index) => ({
        name: key,
        value: data.optionsCount[key]
    })).filter(item => item.value > 0) : [];

    if (!data) {
        return (
            <Card className="glass-card" style={{ height: '100%', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Space direction="vertical" align="center">
                    <InfoCircleOutlined style={{ fontSize: 32, color: token.colorTextQuaternary }} />
                    <Text type="secondary">Select a form to view detailed analytics</Text>
                </Space>
            </Card>
        );
    }

    return (
        <Card
            className="glass-card"
            title={
                <Space direction="vertical" size={0}>
                    <Title level={4} style={{ margin: 0 }}>Analytics</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{formTitle || 'Form Results Overview'}</Text>
                </Space>
            }
            style={{ borderRadius: 24, height: '100%', border: 'none' }}
            styles={{ body: { padding: '24px' } }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 16 }}>Participation Summary</Text>
                    <Row gutter={[12, 12]}>
                        <Col span={12}>
                            <div style={{ background: `${token.colorSuccess}10`, padding: '12px', borderRadius: 12, border: `1px solid ${token.colorSuccess}20` }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Submitted</Text>
                                <Title level={4} style={{ margin: 0, color: token.colorSuccess }}>{data.totalSubmitted}</Title>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ background: `${token.colorInfo}10`, padding: '12px', borderRadius: 12, border: `1px solid ${token.colorInfo}20` }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Pending</Text>
                                <Title level={4} style={{ margin: 0, color: token.colorInfo }}>{data.totalNotSubmitted}</Title>
                            </div>
                        </Col>
                    </Row>
                </div>

                {formType === 'survey' && chartData.length > 0 ? (
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Sentiment Analysis</Text>
                        <div style={{ width: '100%', height: 260, position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        formatter={(value) => <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute',
                                top: '45%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <Title level={2} style={{ margin: 0, fontSize: 24 }}>{data.totalSubmitted}</Title>
                                <Text type="secondary" style={{ fontSize: 10 }}>TOTAL</Text>
                            </div>
                        </div>
                    </div>
                ) : formType === 'survey' ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', background: 'rgba(0,0,0,0.02)', borderRadius: 16 }}>
                        <Text type="secondary">No survey responses yet</Text>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', background: 'rgba(0,0,0,0.02)', borderRadius: 16 }}>
                        <Text type="secondary">Charts are available for surveys</Text>
                    </div>
                )}
            </motion.div>
        </Card>
    );
};

export default FormAnalytics;
