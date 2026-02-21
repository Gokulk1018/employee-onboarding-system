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
                <div style={{ marginBottom: 32 }}>
                    <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: token.colorTextSecondary }}>Participation Summary</Text>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div style={{
                                background: `linear-gradient(135deg, ${token.colorSuccess}15 0%, ${token.colorSuccess}05 100%)`,
                                padding: '16px',
                                borderRadius: 16,
                                border: `1px solid ${token.colorSuccess}30`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: -10, right: -10, color: token.colorSuccess, opacity: 0.1 }}>
                                    <CheckCircleOutlined style={{ fontSize: 40 }} />
                                </div>
                                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>SUBMITTED</Text>
                                <Title level={3} style={{ margin: 0, color: token.colorSuccess, fontWeight: 800 }}>{data.totalSubmitted}</Title>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{
                                background: `linear-gradient(135deg, ${token.colorInfo}15 0%, ${token.colorInfo}05 100%)`,
                                padding: '16px',
                                borderRadius: 16,
                                border: `1px solid ${token.colorInfo}30`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: -10, right: -10, color: token.colorInfo, opacity: 0.1 }}>
                                    <ClockCircleOutlined style={{ fontSize: 40 }} />
                                </div>
                                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>PENDING</Text>
                                <Title level={3} style={{ margin: 0, color: token.colorInfo, fontWeight: 800 }}>{data.totalNotSubmitted}</Title>
                            </div>
                        </Col>
                    </Row>
                </div>

                {(data.totalSubmitted > 0 || true) ? (
                    <div style={{ padding: '0 8px' }}>
                        <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: token.colorTextSecondary }}>Sentiment Analysis</Text>
                        <div style={{ width: '100%', height: 280, position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data.totalSubmitted > 0 ? chartData : [{ name: 'No Data', value: 1 }]}
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={data.totalSubmitted > 0 ? 10 : 0}
                                        dataKey="value"
                                        stroke="none"
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        {data.totalSubmitted > 0 ? (
                                            chartData.map((entry, index) => {
                                                const sentimentColors = {
                                                    'Good': '#52c41a',
                                                    'Neutral': '#faad14',
                                                    'Bad': '#ff4d4f'
                                                };
                                                const color = sentimentColors[entry.name] || COLORS[index % COLORS.length];
                                                return <Cell key={`cell-${index}`} fill={color} cornerRadius={8} />;
                                            })
                                        ) : (
                                            <Cell fill={`${token.colorTextQuaternary}20`} />
                                        )}
                                    </Pie>
                                    {data.totalSubmitted > 0 && (
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 16,
                                                border: 'none',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                                background: token.colorBgContainer,
                                                backdropFilter: 'blur(10px)'
                                            }}
                                            itemStyle={{ fontWeight: 600 }}
                                        />
                                    )}
                                    {data.totalSubmitted > 0 && (
                                        <Legend
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ paddingTop: 20 }}
                                            formatter={(value) => <span style={{ fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>{value}</span>}
                                        />
                                    )}
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute',
                                top: '42%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 800, color: data.totalSubmitted > 0 ? token.colorPrimary : token.colorTextQuaternary }}>
                                    {data.totalSubmitted}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>TOTAL</Text>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', background: 'rgba(0,0,0,0.02)', borderRadius: 16 }}>
                        <Text type="secondary">No responses yet</Text>
                    </div>
                )}
            </motion.div>
        </Card>
    );
};

export default FormAnalytics;
