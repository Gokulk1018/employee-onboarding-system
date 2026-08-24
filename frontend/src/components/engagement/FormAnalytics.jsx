import React, { useState } from 'react';
import { Row, Col, Statistic, Card, theme, Typography, Space, Tabs, List, Avatar, Tag, Empty } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircleOutlined, UserOutlined, ClockCircleOutlined, InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Text, Title } = Typography;

const FormAnalytics = ({ data, formType, formTitle }) => {
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState('1');

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

    const EmployeeList = ({ employees, type }) => (
        <List
            itemLayout="horizontal"
            dataSource={employees}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No ${type} employees`} /> }}
            renderItem={(emp) => (
                <List.Item style={{ padding: '12px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                    <List.Item.Meta
                        avatar={<Avatar src={emp.avatar} icon={<UserOutlined />} style={{ border: `2px solid ${type === 'submitted' ? token.colorSuccess : token.colorWarning}40` }} />}
                        title={<Text strong>{emp.name}</Text>}
                        description={<Text type="secondary" style={{ fontSize: 12 }}>{emp.department || 'General'}</Text>}
                    />
                    <Tag color={type === 'submitted' ? 'success' : 'warning'} style={{ borderRadius: 12, fontSize: 10, border: 'none' }}>
                        {type === 'submitted' ? 'Completed' : 'Pending'}
                    </Tag>
                </List.Item>
            )}
            style={{ height: 420, overflowY: 'auto', paddingRight: 8 }}
        />
    );

    const items = [
        {
            key: '1',
            label: 'Overview',
            children: (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ height: 450 }}>
                    <div style={{ marginBottom: 32 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div style={{
                                    background: `linear-gradient(135deg, ${token.colorSuccess}15 0%, ${token.colorSuccess}05 100%)`,
                                    padding: '16px',
                                    borderRadius: 16,
                                    border: `1px solid ${token.colorSuccess}30`,
                                    position: 'relative'
                                }}>
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
                                    position: 'relative'
                                }}>
                                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>PENDING</Text>
                                    <Title level={3} style={{ margin: 0, color: token.colorInfo, fontWeight: 800 }}>{data.totalNotSubmitted}</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {data.totalSubmitted > 0 ? (
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: token.colorTextSecondary }}>Sentiment Analysis</Text>
                            <div style={{ width: '100%', height: 260, position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => {
                                                const sentimentColors = { 'Good': '#52c41a', 'Neutral': '#faad14', 'Bad': '#ff4d4f' };
                                                return <Cell key={`cell-${index}`} fill={sentimentColors[entry.name] || COLORS[index % COLORS.length]} cornerRadius={8} />;
                                            })}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                                        <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: token.colorPrimary }}>{data.totalSubmitted}</Title>
                                    <Text type="secondary" style={{ fontSize: 10, fontWeight: 700 }}>TOTAL</Text>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Empty description="No responses yet" style={{ marginTop: 40 }} />
                    )}
                </motion.div>
            )
        },
        {
            key: '2',
            label: 'Participation',
            children: (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ height: 450, overflowY: 'auto' }}>
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: token.colorTextSecondary }}>
                            Completed ({data.submittedEmployees?.length || 0})
                        </Text>
                        <List
                            itemLayout="horizontal"
                            dataSource={data.submittedEmployees}
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No submitted employees`} /> }}
                            renderItem={(emp) => (
                                <List.Item style={{ padding: '8px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={emp.avatar} size="small" icon={<UserOutlined />} />}
                                        title={<Text strong style={{ fontSize: 13 }}>{emp.name}</Text>}
                                    />
                                    <Tag color="success" style={{ borderRadius: 12, fontSize: 9 }}>Done</Tag>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div style={{ marginTop: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: token.colorWarning }}>
                            Pending ({data.pendingEmployees?.length || 0})
                        </Text>
                        <List
                            itemLayout="horizontal"
                            dataSource={data.pendingEmployees}
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No pending employees`} /> }}
                            renderItem={(emp) => (
                                <List.Item style={{ padding: '8px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={emp.avatar} size="small" icon={<UserOutlined />} />}
                                        title={<Text strong style={{ fontSize: 13 }}>{emp.name}</Text>}
                                    />
                                    <Tag color="warning" style={{ borderRadius: 12, fontSize: 9 }}>Pending</Tag>
                                </List.Item>
                            )}
                        />
                    </div>
                </motion.div>
            )
        }
    ];

    return (
        <Card
            className="glass-card"
            title={
                <Space direction="vertical" size={0}>
                    <Title level={4} style={{ margin: 0 }}>Analytics</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>{formTitle || 'Form Results Overview'}</Text>
                </Space>
            }
            style={{ borderRadius: 24, height: 600, border: 'none' }}
            styles={{ body: { padding: '12px 24px 24px' } }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="premium-tabs"
            />
        </Card>
    );
};

export default FormAnalytics;
