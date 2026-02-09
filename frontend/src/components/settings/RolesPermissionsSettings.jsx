import React from 'react';
import { Card, Table, Switch, Typography, theme, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RolesPermissionsSettings = () => {
    const { token } = theme.useToken();
    const [permissions, setPermissions] = React.useState({
        Admin: { canPostJob: true, canSendOffer: true, canViewSalary: true },
        HR: { canPostJob: true, canSendOffer: true, canViewSalary: true },
        Manager: { canPostJob: false, canSendOffer: false, canViewSalary: true },
        Employee: { canPostJob: false, canSendOffer: false, canViewSalary: false }
    });

    const handlePermissionChange = (role, permission, value) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [permission]: value
            }
        }));
    };

    const handleSave = () => {
        console.log('Roles & Permissions:', permissions);
        message.success('Permissions saved successfully');
    };

    const columns = [
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (text) => <strong style={{ color: token.colorText }}>{text}</strong>
        },
        {
            title: 'Can Post Job',
            dataIndex: 'canPostJob',
            key: 'canPostJob',
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={permissions[record.role].canPostJob}
                    onChange={(checked) => handlePermissionChange(record.role, 'canPostJob', checked)}
                />
            )
        },
        {
            title: 'Can Send Offer',
            dataIndex: 'canSendOffer',
            key: 'canSendOffer',
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={permissions[record.role].canSendOffer}
                    onChange={(checked) => handlePermissionChange(record.role, 'canSendOffer', checked)}
                />
            )
        },
        {
            title: 'Can View Salary',
            dataIndex: 'canViewSalary',
            key: 'canViewSalary',
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={permissions[record.role].canViewSalary}
                    onChange={(checked) => handlePermissionChange(record.role, 'canViewSalary', checked)}
                />
            )
        }
    ];

    const dataSource = [
        { key: '1', role: 'Admin' },
        { key: '2', role: 'HR' },
        { key: '3', role: 'Manager' },
        { key: '4', role: 'Employee' }
    ];

    return (
        <Card bordered={false} className="glass-card">
            <Title level={5} style={{ marginBottom: 16, color: token.colorText }}>
                Role-Based Permissions
            </Title>

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                className="glass-table"
                style={{ marginBottom: 24 }}
            />

            <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSave}>
                Save Permissions
            </Button>
        </Card>
    );
};

export default RolesPermissionsSettings;
