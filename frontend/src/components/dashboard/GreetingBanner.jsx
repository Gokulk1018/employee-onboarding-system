import React, { useState, useEffect } from 'react';
import { Card, Typography, theme, Row, Col, Space } from 'antd';
import { motion } from 'framer-motion';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const GreetingBanner = ({ metrics }) => {
    const { token } = theme.useToken();
    const time = dayjs().hour();
    const greeting = time < 12 ? 'Good Morning' : time < 18 ? 'Good Afternoon' : 'Good Evening';
    const [hrName, setHrName] = useState(localStorage.getItem('name') || localStorage.getItem('username') || 'HR');

    useEffect(() => {
        const handleStorageChange = () => {
            setHrName(localStorage.getItem('name') || localStorage.getItem('username') || 'HR');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 24 }}
            className="glass-card"
        >
            <div
                style={{
                    background: `linear-gradient(135deg, ${token.colorPrimary}15 0%, ${token.colorInfo}15 100%)`,
                    padding: '24px 32px',
                    borderRadius: 16,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background elements */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: token.colorPrimary, borderRadius: '50%', opacity: 0.05, filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: token.colorInfo, borderRadius: '50%', opacity: 0.05, filter: 'blur(40px)' }} />

                <Row justify="space-between" align="middle" style={{ position: 'relative', zIndex: 1 }}>
                    <Col>
                        <Title level={2} style={{ margin: 0, fontWeight: 700 }} className="text-gradient">
                            {greeting}, {hrName}! <span style={{ fontSize: 24 }}>👋</span>
                        </Title>
                        <Text style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                            Here's what's happening with your team today.
                        </Text>
                    </Col>
                    <Col>
                        <Space size="large" split={<div style={{ width: 1, height: 40, background: token.colorSplit }} />}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {metrics?.totalEmployees?.toLocaleString() || 0}
                                </div>
                                <Text style={{ color: 'var(--text-secondary)' }}>Total Employees</Text>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {metrics?.activeEmployees || 0}
                                </div>
                                <Text style={{ color: 'var(--text-secondary)' }}>Active Today</Text>
                            </div>
                        </Space>
                    </Col>
                </Row>
            </div>
        </motion.div>
    );
};

export default GreetingBanner;
