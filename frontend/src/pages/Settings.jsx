import React from 'react';
import { Typography, Tabs, theme } from 'antd';
import {
    BankOutlined,
    SafetyOutlined,
    LockOutlined
} from '@ant-design/icons';
import CompanySettings from '../components/settings/CompanySettings';
import RolesPermissionsSettings from '../components/settings/RolesPermissionsSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Settings = () => {
    const { token } = theme.useToken();

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
            label: <span><BankOutlined /> Company Settings</span>,
            children: <CompanySettings />,
        },
        {
            key: '2',
            label: <span><SafetyOutlined /> Roles & Permissions</span>,
            children: <RolesPermissionsSettings />,
        },
        {
            key: '3',
            label: <span><LockOutlined /> Security</span>,
            children: <SecuritySettings />,
        },
    ];

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1200, margin: '0 auto' }}
            >
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">
                            Settings
                        </Title>
                        <div style={{ color: token.colorTextSecondary }}>
                            Configure your HR system preferences
                        </div>
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
