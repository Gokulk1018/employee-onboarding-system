import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space,
    theme,
    message,
    ConfigProvider
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const { Title, Text } = Typography;

const CandidateLogin = () => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const { username, password } = values;

        try {
            const response = await axios.post('http://localhost:5000/api/onboarding/login', {
                username,
                password
            });

            if (response.data.success) {
                const { data } = response.data;
                localStorage.setItem('userRole', 'candidate');
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userId', data.userId); // Added for header consistency
                localStorage.setItem('username', data.username);
                localStorage.setItem('candidateName', data.candidateName);
                localStorage.setItem('offerId', data.offerId);

                message.success('Welcome to your Onboarding Portal!');
                navigate('/onboarding-dashboard');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#8b5cf6',
                    borderRadius: 12,
                }
            }}
        >
            <div className={`page ${isDarkMode ? 'dark' : 'light'}`} style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDarkMode ? 'radial-gradient(#1e1b4b, #020617)' : 'linear-gradient(#f5f3ff, #ffffff)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: 400, padding: 20 }}
                >
                    <Card
                        variant="borderless"
                        className={isDarkMode ? "glass-premium neon-glow-purple" : "glass-card"}
                        style={{ borderRadius: 24, textAlign: 'center' }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ marginBottom: 20 }}>
                                <img src="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg" alt="Logo" style={{ width: 60 }} />
                                <Title level={2} style={{ marginTop: 16 }}>Onboarding Portal</Title>
                                <Text type="secondary">Enter your credentials from the email</Text>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                size="large"
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please enter your username' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Username"
                                        style={{ height: 50 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please enter your password' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Password"
                                        style={{ height: 50 }}
                                    />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    icon={<ArrowRightOutlined />}
                                    style={{ height: 50, fontWeight: 700, marginTop: 10 }}
                                >
                                    ACCESS PORTAL
                                </Button>
                            </Form>

                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Having trouble logging in? Contact HR.
                            </Text>
                        </Space>
                    </Card>
                </motion.div>
            </div>
        </ConfigProvider>
    );
};

export default CandidateLogin;
