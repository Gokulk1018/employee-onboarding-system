import React from 'react';
import { Typography, Tabs, Button, theme } from 'antd';
import { SaveOutlined, UserOutlined, BellOutlined, LockOutlined, CreditCardOutlined } from '@ant-design/icons';
import ThemeSettings from '../components/settings/ThemeSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import BillingSettings from '../components/settings/BillingSettings';
import { motion, AnimatePresence } from 'framer-motion';
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

    const tabItems = [
        {
            key: '1',
            label: <span><UserOutlined /> Appearance</span>,
            children: <ThemeSettings />,
        },
        {
            key: '2',
            label: <span><BellOutlined /> Notifications</span>,
            children: <NotificationSettings />,
        },
        {
            key: '3',
            label: <span><LockOutlined /> Security</span>,
            children: <SecuritySettings />,
        },
        {
            key: '4',
            label: <span><CreditCardOutlined /> Billing</span>,
            children: <BillingSettings />,
        },
    ];

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
                </div>

                <Tabs
                    defaultActiveKey="1"
                    items={tabItems.map(item => ({
                        ...item,
                        children: (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.children}
                            </motion.div>
                        )
                    }))}
                    className="glass-tabs"
                />
            </motion.div>
        </PageContainer>
    );
};
export default Settings;
