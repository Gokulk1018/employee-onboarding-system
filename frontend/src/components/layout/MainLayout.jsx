import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Input, Badge, Dropdown, theme, Avatar, Space, Typography } from 'antd';
import {
    UserOutlined,
    BellOutlined,
    DashboardOutlined,
    TeamOutlined,
    CalendarOutlined,
    DollarOutlined,
    SolutionOutlined,
    FallOutlined,
    HeartOutlined,
    RobotOutlined,
    SettingOutlined,
    LogoutOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import AIAssistant from '../common/AIAssistant';
import { motion } from 'framer-motion';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const [pathname, setPathname] = useState(location.pathname);

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/employees', name: 'Employees', icon: <TeamOutlined /> },
        { path: '/payroll', name: 'Payroll', icon: <DollarOutlined /> },
        { path: '/recruitment', name: 'Recruitment', icon: <SolutionOutlined /> },
        { path: '/onboarding', name: 'Onboarding', icon: <UserOutlined /> },
        { path: '/performance', name: 'Performance', icon: <FallOutlined /> },
        { path: '/engagement', name: 'Engagement', icon: <HeartOutlined /> },
        { path: '/tasks', name: 'Tasks', icon: <CalendarOutlined /> },
        { path: '/settings', name: 'Settings', icon: <SettingOutlined /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        sessionStorage.clear();
        navigate('/login', { replace: true });
    };

    const profileMenu = {
        items: [
            { key: 'profile', label: 'Profile' },
            { key: 'settings', label: 'Settings' },
            { type: 'divider' },
            { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
        ],
        onClick: ({ key }) => {
            if (key === 'logout') {
                handleLogout();
            }
        }
    };

    return (
        <div style={{ height: '100vh' }}>
            <ProLayout
                layout="mix"
                navTheme="light"
                colorPrimary={token.colorPrimary}
                siderWidth={250}
                fixSiderbar
                fixedHeader
                title={
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-gradient"
                        style={{ fontSize: 24, fontWeight: 700 }}
                    >
                        HRFlow
                    </motion.div>
                }
                logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
                location={{ pathname: location.pathname }}
                route={{ routes: menuItems }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/');
                            navigate(item.path || '/');
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: 8,
                            transition: 'all 0.2s'
                        }}
                    >
                        {dom}
                    </div>
                )}
                avatarProps={{
                    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    size: 'default',
                    title: <span style={{ color: token.colorText, fontWeight: 600 }}>Admin User</span>,
                    render: (props, dom) => (
                        <Dropdown menu={profileMenu}>
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 8, background: token.colorBgLayout }}>
                                {dom}
                            </div>
                        </Dropdown>
                    ),
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        <Input
                            key="search"
                            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                            placeholder="Search..."
                            variant="borderless"
                            style={{
                                width: 240,
                                backgroundColor: token.colorBgContainer,
                                borderRadius: 20,
                                marginRight: 16,
                                padding: '6px 12px',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        />,
                        <ThemeToggle key="theme" />,
                        <Badge dot count={3} size="small" key="notifications" offset={[-4, 4]}>
                            <div style={{
                                width: 40, height: 40,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '50%', background: token.colorBgContainer,
                                cursor: 'pointer', marginLeft: 16,
                                border: `1px solid ${token.colorBorder}`
                            }}>
                                <BellOutlined style={{ fontSize: 18, color: token.colorTextSecondary }} />
                            </div>
                        </Badge>,
                    ];
                }}
                token={{
                    header: {
                        colorBgHeader: 'var(--glass-bg)', // Keep glass effect for header
                        colorHeaderTitle: token.colorText,
                        heightLayoutHeader: 72,
                    },
                    sider: {
                        colorMenuBackground: token.colorBgContainer,
                        colorTextMenu: token.colorTextSecondary,
                        colorTextMenuSelected: token.colorPrimary,
                        colorBgMenuItemSelected: token.colorPrimaryBg,
                    }
                }}
                contentStyle={{
                    padding: 32,
                    minHeight: '100vh',
                    background: 'transparent',
                }}
                headerContentRender={() => {
                    const currentPath = menuItems.find(m => m.path === location.pathname);
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={location.pathname}
                        >
                            <Typography.Title level={4} style={{ margin: 0, color: token.colorText }}>
                                {currentPath?.name || 'Dashboard'}
                            </Typography.Title>
                        </motion.div>
                    );
                }}
            >
                <Outlet />
                <AIAssistant />
            </ProLayout>
        </div>
    );
};

export default MainLayout;
