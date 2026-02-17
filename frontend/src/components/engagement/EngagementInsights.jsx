import React from 'react';
import { Card, Row, Col, Statistic, Typography, theme, Space, Badge } from 'antd';
import { RiseOutlined, TeamOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;

const EngagementInsights = () => {
    const { token } = theme.useToken();

    const stats = [
        {
            title: 'Participation',
            value: '84%',
            icon: <RiseOutlined />,
            color: '#6366f1',
            desc: '+5% from last month',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
        },
        {
            title: 'Active Forms',
            value: '12',
            icon: <CheckCircleOutlined />,
            color: '#10b981',
            desc: '4 pending responses',
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
        },
        {
            title: 'Happiness',
            value: '4.2',
            icon: <HeartOutlined />,
            color: '#f43f5e',
            desc: 'Average sentiment',
            gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)'
        },
        {
            title: 'Shoutouts',
            value: '128',
            icon: <TeamOutlined />,
            color: '#f59e0b',
            desc: 'Peer recognitions',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
        }
    ];

    return (
        <Row gutter={[16, 16]}>
            {stats.map((item, index) => (
                <Col xs={12} sm={12} md={6} key={index}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    >
                        <Card
                            className="glass-premium premium-card-hover"
                            style={{
                                borderRadius: 24,
                                border: 'none',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            styles={{ body: { padding: '20px' } }}
                        >
                            {/* Decorative background circle */}
                            <div style={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                borderRadius: '50.4%',
                                background: item.color,
                                opacity: 0.05,
                                zIndex: 0
                            }} />

                            <Space direction="vertical" size={16} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                                <div className="flex-between">
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 14,
                                        background: item.gradient,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 8px 16px ${item.color}40`,
                                        fontSize: 20
                                    }} className="icon-glow">
                                        {item.icon}
                                    </div>
                                    <Space align="center" size={6}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50.4%', background: item.color }} className="animate-pulse" />
                                        <Text style={{ fontSize: 11, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.title}</Text>
                                    </Space>
                                </div>

                                <div>
                                    <Title level={2} style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
                                        {item.value}
                                    </Title>
                                    <div className="flex-between" style={{ marginTop: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>{item.desc}</Text>
                                        <RiseOutlined style={{ color: item.color, fontSize: 14 }} />
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </motion.div>
                </Col>
            ))}
        </Row>
    );
};

const Title = Typography.Title;

export default EngagementInsights;
