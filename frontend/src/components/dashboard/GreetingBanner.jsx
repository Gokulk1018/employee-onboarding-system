import React from 'react';
import { Card, Typography, theme, Row, Col, Space } from 'antd';
import { motion } from 'framer-motion';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const GreetingBanner = () => {
    const { token } = theme.useToken();
    const time = dayjs().hour();
    const greeting = time < 12 ? 'Good Morning' : time < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 24 }}
        >
            <Card
                bordered={false}
                style={{
                    background: `linear-gradient(135deg, ${token.colorPrimary}10 0%, ${token.colorInfo}10 100%)`, // Subtle gradient
                    borderRadius: 16,
                    border: `1px solid ${token.colorPrimary}20`,
                }}
                bodyStyle={{ padding: '24px 32px' }}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0, color: token.colorPrimary, fontWeight: 700 }}>
                            {greeting}, Admin!
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Here's what's happening with your team today.
                        </Text>
                    </Col>
                    <Col>
                        <Space size="large">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: token.colorTextHeading }}>124</div>
                                <Text type="secondary">Total Employees</Text>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: token.colorTextHeading }}>24</div>
                                <Text type="secondary">Active Today</Text>
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </motion.div>
    );
};

export default GreetingBanner;
