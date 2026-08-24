import React from 'react';
import { Table, Avatar, Tag, Space, Button, theme, Tooltip, Popconfirm, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const EmployeeTable = ({ data, loading, onDelete, onEdit, onView, onStatusChange }) => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar || `https://ui-avatars.com/api/?name=${text}&background=random`} size="large" style={{ border: `1px solid ${token.colorBorder}` }} />
                    <div style={{ marginLeft: 8 }}>
                        <div style={{ fontWeight: 600, color: token.colorText }}>{text}</div>
                        <div style={{ fontSize: 13, color: token.colorTextSecondary }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <span style={{ color: token.colorText, fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <span style={{ color: token.colorTextSecondary }}>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const getStatusStyle = (s) => {
                    let color = 'default';
                    let bg = 'rgba(0,0,0,0.05)';
                    let border = 'transparent';

                    if (s === 'Active') {
                        color = token.colorSuccess;
                        bg = `${token.colorSuccess}15`;
                        border = `${token.colorSuccess}30`;
                    }
                    else if (s === 'On Leave') {
                        color = token.colorWarning;
                        bg = `${token.colorWarning}15`;
                        border = `${token.colorWarning}30`;
                    }
                    else if (s === 'Inactive') {
                        color = token.colorError;
                        bg = `${token.colorError}15`;
                        border = `${token.colorError}30`;
                    }
                    else if (s === 'Probation') {
                        color = token.colorInfo;
                        bg = `${token.colorInfo}15`;
                        border = `${token.colorInfo}30`;
                    }
                    return { color, bg, border };
                };

                const { color, bg, border } = getStatusStyle(status);

                return (
                    <Select
                        defaultValue={status}
                        variant="borderless"
                        suffixIcon={null}
                        onChange={(value) => onStatusChange(record._id, value)}
                        style={{ width: 100 }}
                        styles={{ popup: { root: { borderRadius: 12, padding: 4 } } }}
                        popupMatchSelectWidth={false}
                    >
                        {['Active', 'On Leave', 'Inactive', 'Probation'].map(s => {
                            const style = getStatusStyle(s);
                            return (
                                <Select.Option key={s} value={s}>
                                    <Tag
                                        style={{
                                            color: style.color,
                                            background: style.bg,
                                            borderColor: style.border,
                                            borderRadius: 12,
                                            padding: '0 10px',
                                            fontWeight: 500,
                                            margin: 0
                                        }}
                                    >
                                        {s}
                                    </Tag>
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (text) => <span style={{ color: token.colorTextSecondary }}>{text ? new Date(text).toLocaleDateString() : 'N/A'}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            style={{ color: token.colorInfo }}
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete employee"
                        description="Are you sure you want to delete this employee?"
                        onConfirm={() => onDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" icon={<DeleteOutlined />} style={{ color: token.colorError }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            loading={loading}
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
