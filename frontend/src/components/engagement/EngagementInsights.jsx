import React from 'react';
import { Card, Row, Col, Statistic, Typography, theme } from 'antd';
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
            desc: '+5% from last month'
        },
        {
            title: 'Active Forms',
            value: '12',
            icon: <CheckCircleOutlined />,
            color: '#10b981',
            desc: '4 pending responses'
        },
        {
            title: 'Happiness',
            value: '4.2',
            icon: <HeartOutlined />,
            color: '#f43f5e',
            desc: 'Average sentiment'
        },
        {
            title: 'Shoutouts',
            value: '128',
            icon: <TeamOutlined />,
            color: '#f59e0b',
            desc: 'Peer recognitions'
        }
    ];

    return (
        <Row gutter={[16, 16]}>
            {stats.map((item, index) => (
                <Col xs={12} sm={12} md={6} key={index}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ translateY: -5 }}
                    >
                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 16,
                                border: 'none',
                                background: `${item.color}10`,
                            }}
                            styles={{ body: { padding: 16 } }}
                        >
                            <div className="flex-between" style={{ marginBottom: 8 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: item.color, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </div>
                                <Text style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.title}</Text>
                            </div>
                            <Title level={3} style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>
                                {item.value}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.desc}</Text>
                        </Card>
                    </motion.div>
                </Col>
            ))}
        </Row>
    );
};

const Title = Typography.Title;

export default EngagementInsights;
