import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, theme, Typography } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, CalendarOutlined, ProjectOutlined, SettingOutlined, RocketOutlined, CarryOutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const EmployeePortalLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const { isDarkMode } = useTheme();

    const menuItems = [
        { path: '/employee/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/employee/profile', name: 'My Profile', icon: <UserOutlined /> },
        { path: '/employee/tasks', name: 'My Tasks', icon: <CalendarOutlined /> },
        { path: '/employee/leave', name: 'Leave Apply', icon: <CarryOutOutlined /> },
        { path: '/employee/settings', name: 'Settings', icon: <SettingOutlined /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ minHeight: '100vh', background: token.colorBgLayout }}>
            {/* Animated Backdrop for "Legendary" UI */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '400px',
                background: 'linear-gradient(180deg, rgba(24, 144, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <ProLayout
                layout="top"
                fixedHeader
                logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
                title="Employee Portal"
                location={{ pathname: location.pathname }}
                route={{ routes: menuItems }}
                navTheme={isDarkMode ? 'dark' : 'light'}
                menuProps={{
                    style: {
                        background: 'transparent',
                        border: 'none',
                        fontWeight: 600,
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingRight: 24,
                    }
                }}
                headerStyle={{
                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    padding: '0 40px',
                    height: 72,
                    lineHeight: '72px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: isDarkMode ? '0 4px 30px rgba(0, 0, 0, 0.3)' : '0 4px 30px rgba(0, 0, 0, 0.03)'
                }}
                menuItemRender={(item, dom) => (
                    <motion.div
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(item.path || '/employee/dashboard')}
                        style={{ cursor: 'pointer', padding: '0 12px' }}
                    >
                        {dom}
                    </motion.div>
                )}
                avatarProps={{
                    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    title: localStorage.getItem('name') || 'Employee',
                    render: (props, dom) => (
                        <Dropdown menu={{
                            items: [
                                { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
                            ],
                            onClick: ({ key }) => key === 'logout' && handleLogout()
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px 8px', borderRadius: 12, background: 'rgba(0,0,0,0.02)' }}
                            >
                                {dom}
                            </motion.div>
                        </Dropdown>
                    ),
                }}
                actionsRender={() => [
                    <div key="actions" style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16 }}>
                        <ThemeToggle />
                    </div>
                ]}
                contentStyle={{
                    padding: '24px 50px',
                    maxWidth: 1400,
                    margin: '0 auto',
                    minHeight: 'calc(100vh - 64px)'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    key={location.pathname}
                >
                    <Outlet />
                </motion.div>
            </ProLayout>
        </div>
    );
};

export default EmployeePortalLayout;
