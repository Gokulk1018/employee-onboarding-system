import React, { useState } from 'react';
import {
    Card, Typography, Switch, Button, Form,
    Input, Divider, Space, Row, Col, theme, Tabs, Avatar, Tag, App
} from 'antd';
import {
    LockOutlined, BellOutlined, GlobalOutlined,
    SafetyCertificateOutlined, UserOutlined, SettingOutlined,
    BgColorsOutlined, NotificationOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const EmployeeSettings = () => {
    const { token } = theme.useToken();
    const { message: msg } = App.useApp();
    const { isDarkMode, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onPasswordChange = async (values) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.put('http://localhost:5000/api/auth/change-password', {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            }, {
                headers: { 'x-user-id': userId }
            });

            if (response.data.success) {
                msg.success('Password updated successfully');
                form.resetFields();
            }
        } catch (error) {
            msg.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const SettingItem = ({ icon, title, description, action }) => (
        <motion.div
            variants={itemVariants}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 16,
                marginBottom: 12,
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <Space size="middle">
                <div style={{
                    padding: 12,
                    borderRadius: 12,
                    background: isDarkMode ? 'rgba(24, 144, 255, 0.15)' : 'rgba(24, 144, 255, 0.05)',
                    color: token.colorPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {React.cloneElement(icon, { style: { fontSize: 20 } })}
                </div>
                <div>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>{title}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>{description}</Text>
                </div>
            </Space>
            {action}
        </motion.div>
    );

    const tabsItems = [
        {
            key: 'security',
            label: <Space><SafetyCertificateOutlined /> Security</Space>,
            children: (
                <div style={{ padding: '4px 0' }}>
                    <Title level={4} style={{ marginBottom: 24 }}>Account Security</Title>
                    <Form form={form} layout="vertical" onFinish={onPasswordChange}>
                        <Form.Item
                            label="Current Password"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Current password is required' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                                placeholder="Enter current password"
                                style={{ borderRadius: 12, height: 45 }}
                            />
                        </Form.Item>
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="New Password"
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'New password is required' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                                        placeholder="Min 6 characters"
                                        style={{ borderRadius: 12, height: 45 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                                        placeholder="Match new password"
                                        style={{ borderRadius: 12, height: 45 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            style={{
                                borderRadius: 12,
                                height: 48,
                                padding: '0 32px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                border: 'none',
                                fontWeight: 600,
                                marginTop: 8
                            }}
                        >
                            Update Security Credentials
                        </Button>
                    </Form>

                    <Divider style={{ margin: '40px 0' }} />

                    <Title level={4} style={{ marginBottom: 24 }}>Security Status</Title>
                    <SettingItem
                        icon={<SafetyCertificateOutlined />}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security to your account via authenticator app."
                        action={<Button style={{ borderRadius: 10 }}>Configure</Button>}
                    />
                    <SettingItem
                        icon={<LockOutlined />}
                        title="Login Alerts"
                        description="Get notified when someone logs in from a new device or location."
                        action={<Switch defaultChecked />}
                    />
                </div>
            )
        },
        {
            key: 'preferences',
            label: <Space><SettingOutlined /> Preferences</Space>,
            children: (
                <div style={{ padding: '4px 0' }}>
                    <Title level={4} style={{ marginBottom: 24 }}>System Experience</Title>
                    <SettingItem
                        icon={<BgColorsOutlined />}
                        title="Legendary Dark Mode"
                        description="Switch between light and high-fidelity dark themes for better focus."
                        action={<Switch checked={isDarkMode} onChange={toggleTheme} />}
                    />
                    <SettingItem
                        icon={<NotificationOutlined />}
                        title="Desktop Notifications"
                        description="Receive real-time task updates and announcements on your desktop."
                        action={<Switch defaultChecked />}
                    />
                    <SettingItem
                        icon={<BellOutlined />}
                        title="Email Digests"
                        description="Stay updated with a weekly summary of your progress and team activities."
                        action={<Switch />}
                    />
                    <SettingItem
                        icon={<GlobalOutlined />}
                        title="System Language"
                        description="Choose your preferred language for the entire portal interface."
                        action={<Text strong style={{ color: token.colorPrimary }}>English (US)</Text>}
                    />
                </div>
            )
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}
        >
            <div style={{ marginBottom: 40 }}>
                <Title style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Settings</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    Customize your professional environment and account security
                </Text>
            </div>

            <Row gutter={[32, 32]}>
                <Col span={24}>
                    <Card
                        className="glass-card"
                        style={{ borderRadius: 32, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                        styles={{ body: { padding: 32 } }}
                    >
                        <Tabs
                            defaultActiveKey="security"
                            items={tabsItems}
                            className="legendary-tabs"
                            size="large"
                        />
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default EmployeeSettings;
