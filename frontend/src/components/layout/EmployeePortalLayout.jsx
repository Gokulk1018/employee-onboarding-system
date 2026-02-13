import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, theme, Typography } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, CalendarOutlined, ProjectOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';

const EmployeePortalLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();

    const menuItems = [
        { path: '/employee/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/employee/profile', name: 'My Profile', icon: <UserOutlined /> },
        { path: '/employee/tasks', name: 'My Tasks', icon: <CalendarOutlined /> },
        { path: '/employee/projects', name: 'Projects', icon: <ProjectOutlined /> },
        { path: '/employee/settings', name: 'Settings', icon: <SettingOutlined /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
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
                title="Employee Portal"
                logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
                location={{ pathname: location.pathname }}
                route={{ routes: menuItems }}
                menuItemRender={(item, dom) => (
                    <div onClick={() => navigate(item.path || '/employee/dashboard')}>{dom}</div>
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
                            {dom}
                        </Dropdown>
                    ),
                }}
                actionsRender={() => [<ThemeToggle key="theme" />]}
                contentStyle={{ padding: 32, minHeight: '100vh', background: token.colorBgLayout }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={location.pathname}
                >
                    <Outlet />
                </motion.div>
            </ProLayout>
        </div>
    );
};

export default EmployeePortalLayout;
