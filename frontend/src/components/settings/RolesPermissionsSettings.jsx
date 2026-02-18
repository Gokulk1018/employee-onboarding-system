import React, { useEffect, useState } from 'react';
import { Card, Table, Switch, Typography, theme, Button, message as antdMessage, Spin, Tabs, Badge, Tag, Space, App } from 'antd';
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { getRoles, updateRolePermissions, getUsers, toggleUserStatus } from '../../services/settingsService';

const { Title, Text } = Typography;

const RolesPermissionsSettings = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rolesRes, usersRes] = await Promise.all([getRoles(), getUsers()]);
            if (rolesRes.success) setRoles(rolesRes.data);
            if (usersRes.success) setUsers(usersRes.data);
        } catch (error) {
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePermissionChange = async (roleId, permission, value) => {
        try {
            const role = roles.find(r => r._id === roleId);
            const newPermissions = { ...role.permissions, [permission]: value };

            const res = await updateRolePermissions(roleId, newPermissions);
            if (res.success) {
                setRoles(prev => prev.map(r => r._id === roleId ? res.data : r));
                message.success('Permission updated');
            }
        } catch (error) {
            message.error('Failed to update permission');
        }
    };

    const handleStatusToggle = async (userId, type) => {
        try {
            const res = await toggleUserStatus(userId, type);
            if (res.success) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, accountStatus: u.accountStatus === 'active' ? 'blocked' : 'active' } : u));
                message.success('Account status updated');
            }
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const userColumns = [
        {
            title: 'Employee',
            key: 'employee',
            render: (_, record) => (
                <Space>
                    <Badge dot status={record.accountStatus === 'active' ? 'success' : 'error'}>
                        <Tag color={token.colorPrimaryBg} style={{ border: 'none', margin: 0 }}>
                            {record.name.charAt(0).toUpperCase()}
                        </Tag>
                    </Badge>
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{record.email}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color="blue">{role}</Tag>
        },
        {
            title: 'Login Status',
            key: 'status',
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Switch
                        checked={record.accountStatus === 'active'}
                        onChange={() => handleStatusToggle(record._id, record.type)}
                        size="small"
                    />
                    <Text style={{ fontSize: 10 }}>{record.accountStatus === 'active' ? 'ALLOWED' : 'BLOCKED'}</Text>
                </div>
            )
        }
    ];

    const permissionColumns = [
        {
            title: 'Role',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text) => <strong style={{ color: token.colorText }}>{text}</strong>
        },
        { title: 'Recruitment', dataIndex: ['permissions', 'recruitment'], key: 'recruitment' },
        { title: 'Onboarding', dataIndex: ['permissions', 'onboarding'], key: 'onboarding' },
        { title: 'Payroll', dataIndex: ['permissions', 'payroll'], key: 'payroll' },
        { title: 'Engagement', dataIndex: ['permissions', 'engagement'], key: 'engagement' },
        { title: 'Tasks', dataIndex: ['permissions', 'tasks'], key: 'tasks' },
        { title: 'Settings', dataIndex: ['permissions', 'settings'], key: 'settings' }
    ].map(col => {
        if (col.key === 'name') return col;
        return {
            ...col,
            align: 'center',
            render: (checked, record) => (
                <Switch
                    checked={checked}
                    onChange={(val) => handlePermissionChange(record._id, col.key, val)}
                    size="small"
                />
            )
        };
    });

    const items = [
        {
            key: '1',
            label: <span><UserOutlined /> User Access Control</span>,
            children: (
                <Table
                    columns={userColumns}
                    dataSource={users}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    className="glass-table"
                />
            )
        },
        {
            key: '2',
            label: <span><SafetyCertificateOutlined /> Role Permissions</span>,
            children: (
                <Table
                    columns={permissionColumns}
                    dataSource={roles}
                    rowKey="_id"
                    pagination={false}
                    className="glass-table"
                    scroll={{ x: 600 }}
                />
            )
        }
    ];

    return (
        <Card bordered={false} className="glass-card">
            <Spin spinning={loading}>
                <Tabs defaultActiveKey="1" items={items} />
            </Spin>
        </Card>
    );
};

export default RolesPermissionsSettings;
