import React from 'react';
import { Typography, Row, Col, Tabs, Button, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import ThemeSettings from '../components/settings/ThemeSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Settings = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1000, margin: '0 auto' }}
            >
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }} className="text-gradient">Settings</Title>
                        <div style={{ color: 'var(--text-secondary)' }}>Manage your workspace preferences</div>
                    </div>
                    <Button type="primary" icon={<SaveOutlined />} size="large">Save Changes</Button>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={14}>
                        <motion.div variants={itemVariants}>
                            <ThemeSettings />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={10}>
                        <motion.div variants={itemVariants}>
                            <NotificationSettings />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};
export default Settings;
