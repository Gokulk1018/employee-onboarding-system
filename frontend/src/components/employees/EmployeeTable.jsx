import React from 'react';
import { Table, Avatar, Tag, Space, Button, theme, Tooltip } from 'antd';
import { EditOutlined, MoreOutlined, EyeOutlined } from '@ant-design/icons';

const EmployeeTable = ({ data }) => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} size="large" style={{ border: `1px solid ${token.colorBorder}` }} />
                    <div style={{ marginLeft: 8 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <span style={{ color: 'var(--text-secondary)' }}>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let bg = 'rgba(0,0,0,0.05)';
                let border = 'transparent';

                if (status === 'Active') {
                    color = token.colorSuccess;
                    bg = `${token.colorSuccess}15`;
                    border = `${token.colorSuccess}30`;
                }
                if (status === 'On Leave') {
                    color = token.colorWarning;
                    bg = `${token.colorWarning}15`;
                    border = `${token.colorWarning}30`;
                }
                if (status === 'Probation') {
                    color = token.colorInfo;
                    bg = `${token.colorInfo}15`;
                    border = `${token.colorInfo}30`;
                }

                return (
                    <Tag
                        style={{
                            color,
                            background: bg,
                            borderColor: border,
                            borderRadius: 12,
                            padding: '0 10px',
                            fontWeight: 500
                        }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (text) => <span style={{ color: 'var(--text-secondary)' }}>{text}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button type="text" icon={<EyeOutlined />} style={{ color: token.colorInfo }} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                    <Button type="text" icon={<MoreOutlined />} style={{ color: 'var(--text-secondary)' }} />
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
                pageSize: 5,
                position: ['bottomRight'],
                style: { marginTop: 16 }
            }}
            scroll={{ x: 800 }}
            className="glass-table"
        />
    );
};

export default EmployeeTable;
