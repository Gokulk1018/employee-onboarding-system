import React, { useState, useEffect } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Input, Badge, Dropdown, theme, Avatar, Space, Typography, List, message, Skeleton } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
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
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notifications');
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAllAsRead = async () => {
        try {
            await axios.put('http://localhost:5000/api/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            message.error('Failed to mark notifications as read');
        }
    };

    const notificationMenu = (
        <div style={{
            width: 350,
            background: token.colorBgContainer,
            borderRadius: 12,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${token.colorBorderSecondary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography.Text strong style={{ fontSize: 16 }}>Notifications</Typography.Text>
                <Typography.Link onClick={markAllAsRead} style={{ fontSize: 12 }}>Mark all as read</Typography.Link>
            </div>
            <List
                style={{ maxHeight: 400, overflowY: 'auto' }}
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: '12px 20px',
                            cursor: 'pointer',
                            background: item.isRead ? 'transparent' : `${token.colorPrimary}08`,
                            borderLeft: item.isRead ? 'none' : `3px solid ${token.colorPrimary}`,
                            transition: 'all 0.2s'
                        }}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size="small"
                                    style={{
                                        backgroundColor: item.status === 'Accepted' ? token.colorSuccess : token.colorError,
                                        marginTop: 4
                                    }}
                                />
                            }
                            title={<Typography.Text strong={!item.isRead} style={{ fontSize: 13 }}>{item.message}</Typography.Text>}
                            description={
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                    {dayjs(item.createdAt).fromNow()}
                                </Typography.Text>
                            }
                        />
                    </List.Item>
                )}
                locale={{ emptyText: <div style={{ padding: 40, textAlign: 'center' }}>No notifications</div> }}
            />
        </div>
    );

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
        const authKeys = ['isAuthenticated', 'token', 'userRole', 'username', 'candidateName', 'offerId'];
        authKeys.forEach(key => localStorage.removeItem(key));
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
                        <Dropdown popupRender={() => notificationMenu} trigger={['click']} key="notifications-dropdown">
                            <Badge dot={notifications.some(n => !n.isRead)} count={notifications.filter(n => !n.isRead).length} size="small" offset={[-4, 4]}>
                                <div style={{
                                    width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '50%', background: token.colorBgContainer,
                                    cursor: 'pointer', marginLeft: 16,
                                    border: `1px solid ${token.colorBorder}`
                                }}>
                                    <BellOutlined style={{ fontSize: 18, color: token.colorTextSecondary }} />
                                </div>
                            </Badge>
                        </Dropdown>,
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
                    background: token.colorBgLayout,
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