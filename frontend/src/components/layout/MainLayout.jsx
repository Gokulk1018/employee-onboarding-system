import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Input, Badge, Dropdown, theme, Avatar } from 'antd';
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
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const [pathname, setPathname] = useState(location.pathname);

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/employees', name: 'Employees', icon: <TeamOutlined /> },
        { path: '/attendance', name: 'Attendance', icon: <CalendarOutlined /> },
        { path: '/payroll', name: 'Payroll', icon: <DollarOutlined /> },
        { path: '/recruitment', name: 'Recruitment', icon: <SolutionOutlined /> },
        { path: '/onboarding', name: 'Onboarding', icon: <UserOutlined /> },
        { path: '/performance', name: 'Performance', icon: <FallOutlined /> },
        { path: '/engagement', name: 'Engagement', icon: <HeartOutlined /> },
        { path: '/tasks', name: 'Tasks', icon: <CalendarOutlined /> },
        { path: '/ai-assistant', name: 'AI Assistant', icon: <RobotOutlined /> },
        { path: '/settings', name: 'Settings', icon: <SettingOutlined /> },
    ];

    const profileMenu = {
        items: [
            { key: 'profile', label: 'Profile' },
            { key: 'settings', label: 'Settings' },
            { type: 'divider' },
            { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
        ],
    };

    return (
        <div
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                layout="mix"
                navTheme="light"
                colorPrimary={token.colorPrimary}
                siderWidth={240}
                fixSiderbar
                fixedHeader
                title="HRFlow"
                logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
                location={{
                    pathname: location.pathname,
                }}
                route={{
                    routes: menuItems,
                }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/');
                            navigate(item.path || '/');
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer',
                        }}
                    >
                        {dom}
                    </div>
                )}
                avatarProps={{
                    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    size: 'small',
                    title: 'Admin User',
                    render: (props, dom) => {
                        return (
                            <Dropdown menu={profileMenu}>
                                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {dom}
                                </div>
                            </Dropdown>
                        );
                    },
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        <Input
                            key="search"
                            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                            placeholder="Search..."
                            bordered={false}
                            style={{
                                width: 200,
                                backgroundColor: token.colorBgContainer,
                                borderRadius: token.borderRadius,
                                marginRight: 16
                            }}
                        />,
                        <Badge count={3} size="small" key="notifications" style={{ marginRight: 16 }}>
                            <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: token.colorTextSecondary }} />
                        </Badge>,
                    ];
                }}
                contentStyle={{
                    padding: 24,
                    background: '#f8fafc', // Force light background for content area
                    minHeight: '100vh',
                }}
                headerContentRender={() => {
                    return <div style={{ fontWeight: 600, fontSize: 16 }}>{menuItems.find(m => m.path === location.pathname)?.name || 'Dashboard'}</div>
                }}
            >
                <Outlet />
            </ProLayout>
        </div>
    );
};

export default MainLayout;
