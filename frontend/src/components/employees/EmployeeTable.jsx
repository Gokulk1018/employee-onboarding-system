import React from 'react';
import { Table, Avatar, Tag, Space, Button, theme } from 'antd';
import { EditOutlined, MoreOutlined } from '@ant-design/icons';

const EmployeeTable = ({ data }) => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Active') color = 'success';
                if (status === 'On Leave') color = 'warning';
                if (status === 'Probation') color = 'processing';
                return <Tag color={color} style={{ borderRadius: 12 }}>{status}</Tag>;
            },
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<MoreOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 800 }}
            style={{
                background: token.colorBgContainer,
                borderRadius: 16,
                padding: 16,
                boxShadow: token.boxShadow
            }}
        />
    );
};

export default EmployeeTable;
