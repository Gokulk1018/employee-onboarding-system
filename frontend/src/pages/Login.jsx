import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Checkbox,
    Typography,
    Space,
    theme,
    message,
    ConfigProvider
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [activeRole, setActiveRole] = useState('hr'); // 'hr' or 'employee'
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('isAuthenticated') === 'true') {
            navigate('/dashboard', { replace: true });
        }
        form.resetFields();
    }, [form, navigate]);

    const onFinish = (values) => {
        setLoading(true);
        const { email, password } = values;
        const normalizedInput = email.trim().toLowerCase();
        const validUsernames = [
            "gokulk.1018@gmail.com",
            "gokul"
        ];

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            if (activeRole === 'hr') {
                if (validUsernames.includes(normalizedInput) && password === '1018') {
                    localStorage.setItem('userRole', 'hr');
                    localStorage.setItem('token', 'mock-hr-jwt');
                    localStorage.setItem('isAuthenticated', 'true');
                    message.success('Welcome back, Admin!');
                    navigate('/dashboard');
                } else {
                    message.error('Invalid HR credentials');
                }
                return;
            }

            // Employee Auth
            // For now, we simulate the check against "mock" but the user role will be set correctly.
            // In a real app, this would be an API call verifying credentials from the database.
            // Since we're told NOT to modify the backend auth yet, we'll keep it simple.

            localStorage.setItem('userRole', 'employee');
            localStorage.setItem('token', 'mock-employee-jwt');
            localStorage.setItem('isAuthenticated', 'true');
            message.success('Welcome back, Employee!');
            navigate('/employee-portal');

        }, 1500);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#a855f7', // Purple accent
                    borderRadius: 12,
                },
                components: {
                    Input: {
                        colorBgContainer: isDarkMode ? '#0b1220' : '#f9fafb',
                        colorText: isDarkMode ? '#ffffff' : '#0f172a',
                        colorTextPlaceholder: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15, 23, 42, 0.4)',
                        colorBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
                        activeBorderColor: '#8b5eef',
                        hoverBorderColor: '#8b5eef',
                        controlOutline: isDarkMode ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.2)',
                    }
                }
            }}
        >
            <div className={`page ${isDarkMode ? 'dark' : 'light'}`} style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                backgroundColor: isDarkMode ? '#020617' : '#f8fafc'
            }}>
                {/* Left Side: Brand Panel */}
                <div style={{
                    flex: 1.2,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 8%',
                    color: isDarkMode ? '#fff' : '#0f172a'
                }} className={isDarkMode ? 'mesh-gradient' : ''}>
                    {/* Animated Particles (CSS based fallback) */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.1, y: Math.random() * 1000 }}
                                animate={{
                                    y: [Math.random() * 1000, -200],
                                    opacity: [0.1, 0.4, 0.1]
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 10,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 10
                                }}
                                style={{
                                    position: 'absolute',
                                    left: `${Math.random() * 100}%`,
                                    width: Math.random() * 4 + 2,
                                    height: Math.random() * 4 + 2,
                                    background: '#fff',
                                    borderRadius: '50%',
                                    filter: 'blur(1px)'
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        style={{ position: 'relative', zIndex: 10 }}
                    >
                        <Space align="center" size="middle" style={{ marginBottom: 40 }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16, backdropFilter: 'blur(10px)' }}>
                                <img src="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg" alt="Logo" style={{ width: 40 }} />
                            </div>
                            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: isDarkMode ? '#fff' : '#0f172a' }}>HRFlow</span>
                        </Space>

                        <Title level={1} className={isDarkMode ? "gradient-text-hero" : ""} style={{ fontSize: '4.5rem', margin: 0, fontWeight: 800, lineHeight: 1.1, letterSpacing: -3, color: isDarkMode ? undefined : '#0f172a' }}>
                            Build Your <br />
                            Workforce <br />
                            Smarter
                        </Title>

                        <Text style={{ fontSize: '1.5rem', color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(15, 23, 42, 0.6)', marginTop: 24, display: 'block', fontWeight: 300 }}>
                            Enterprise HR Management Platform
                        </Text>
                    </motion.div>
                </div>

                {/* Right Side: Login Card */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5%',
                    backgroundColor: isDarkMode ? '#020617' : '#ffffff',
                    backgroundImage: isDarkMode
                        ? 'none'
                        : 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.08), transparent 60%)',
                    position: 'relative'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ width: '100%', maxWidth: 480 }}
                    >
                        <Card
                            bordered={false}
                            className={isDarkMode ? "glass-premium neon-glow-purple" : "glass-card"}
                            style={{
                                borderRadius: 24,
                                padding: '32px 16px',
                                boxShadow: isDarkMode ? undefined : '0 20px 50px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                <Title level={2} style={{ color: isDarkMode ? '#fff' : '#0f172a', margin: 0, fontWeight: 700 }}>Welcome back</Title>
                                <Text style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(15, 23, 42, 0.5)', fontSize: 16 }}>Sign in to continue your workflow</Text>
                            </div>

                            {/* Role Toggle */}
                            <div style={{
                                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                padding: 6,
                                borderRadius: 16,
                                display: 'flex',
                                marginBottom: 40,
                                position: 'relative'
                            }}>
                                <motion.div
                                    animate={{ x: activeRole === 'hr' ? 0 : '100%' }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    style={{
                                        position: 'absolute',
                                        width: '50%',
                                        height: 'calc(100% - 12px)',
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                        borderRadius: 12,
                                        boxShadow: activeRole === (isDarkMode ? 'hr' : 'hr') // Dummy ternary to satisfy logic if needed, but really just updating styles
                                            ? (isDarkMode ? '0 4px 12px rgba(168, 85, 247, 0.4)' : '0 6px 20px rgba(99,102,241,0.35)')
                                            : 'none'
                                    }}
                                />
                                <div
                                    onClick={() => setActiveRole('hr')}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '12px 0',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                        color: activeRole === 'hr' ? '#fff' : (isDarkMode ? 'rgba(255,255,255,0.5)' : '#6b7280'),
                                        fontWeight: 600,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    HR ADMIN
                                </div>
                                <div
                                    onClick={() => setActiveRole('employee')}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '12px 0',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                        color: activeRole === 'employee' ? '#fff' : (isDarkMode ? 'rgba(255,255,255,0.5)' : '#6b7280'),
                                        fontWeight: 600,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    EMPLOYEE
                                </div>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                size="large"
                                autoComplete="off"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Required' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                                            placeholder="Email or Username"
                                            style={{ height: 52, fontSize: 16, backgroundColor: 'transparent' }}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Required' }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                                            placeholder="Password"
                                            iconRender={visible => (visible ? <EyeTwoTone twoToneColor="#a855f7" /> : <EyeInvisibleOutlined />)}
                                            style={{ height: 52, fontSize: 16, backgroundColor: 'transparent' }}
                                            autoComplete="new-password"
                                        />
                                    </Form.Item>
                                </motion.div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                                    <Checkbox style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(15, 23, 42, 0.5)' }}>Remember me</Checkbox>
                                    <Link style={{ color: '#a855f7', fontWeight: 500 }}>Forgot?</Link>
                                </div>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        icon={!loading && <ArrowRightOutlined />}
                                        style={{
                                            height: 52,
                                            fontSize: 16,
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                                            border: 'none',
                                            boxShadow: '0 10px 20px -5px rgba(168, 85, 247, 0.5)'
                                        }}
                                    >
                                        {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default LoginPage;
