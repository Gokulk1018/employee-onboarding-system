import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, theme, Space, Badge, App } from 'antd';
import { RiseOutlined, TeamOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getEngagementInsights } from '../../services/engagementService';

const { Text } = Typography;

const EngagementInsights = () => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const res = await getEngagementInsights();
            if (res.success) {
                setInsights(res.data);
            }
        } catch (error) {
            console.error('Failed to load insights:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const stats = [
        {
            title: 'Participation',
            value: insights?.participation || '0%',
            icon: <RiseOutlined />,
            color: '#6366f1',
            desc: insights?.participationTrend || '+0% from last month',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
        },
        {
            title: 'Active Forms',
            value: insights?.activeForms || '0',
            icon: <CheckCircleOutlined />,
            color: '#10b981',
            desc: 'Ongoing engagement',
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
        },
        {
            title: 'Happiness',
            value: insights?.happiness || '5.0',
            icon: <HeartOutlined />,
            color: '#f43f5e',
            desc: insights?.happinessLabel || 'Average sentiment',
            gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)'
        }
    ];

    if (loading && !insights) {
        return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Space><Badge status="processing" /> <Text type="secondary">Loading insights...</Text></Space></div>;
    }

    return (
        <Row gutter={[16, 16]}>
            {stats.map((item, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
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
