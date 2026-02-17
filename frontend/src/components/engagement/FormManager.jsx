import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, theme, Badge, App, Tooltip } from 'antd';
import { PlusOutlined, BarChartOutlined, EyeOutlined, FormOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Popconfirm } from 'antd';
import { getForms, getFormAnalytics, deleteForm } from '../../services/engagementService';
import FormCreator from './FormCreator';

const { Title, Text } = Typography;

const FormManager = ({ onSelectForm }) => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatorVisible, setIsCreatorVisible] = useState(false);
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [editingForm, setEditingForm] = useState(null);

    const fetchForms = async () => {
        try {
            setLoading(true);
            const res = await getForms();
            if (res.success) {
                setForms(res.data);
                // Select first form by default if exists
                if (res.data.length > 0 && !selectedRowKey) {
                    handleRowClick(res.data[0]);
                }
            }
        } catch (error) {
            message.error('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await deleteForm(id);
            if (res.success) {
                message.success('Form deleted successfully');
                fetchForms();
            }
        } catch (error) {
            message.error('Failed to delete form');
        }
    };

    const handleEdit = (record) => {
        setEditingForm(record);
        setIsCreatorVisible(true);
    };

    const handleRowClick = async (record) => {
        setSelectedRowKey(record._id);
        if (onSelectForm) {
            try {
                const res = await getFormAnalytics(record._id);
                if (res.success) {
                    onSelectForm(record, res.data);
                }
            } catch (error) {
                message.error('Failed to load analytics');
            }
        }
    };

    const columns = [
        {
            title: 'FORM DETAILS',
            key: 'title',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 14 }}>{record.title}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.category}</Text>
                </Space>
            ),
        },
        {
            title: 'TYPE',
            dataIndex: 'formType',
            key: 'formType',
            align: 'center',
            render: (type) => (
                <Tag
                    color={type === 'survey' ? 'blue' : 'purple'}
                    style={{ borderRadius: 20, fontSize: 10, padding: '0 10px', fontWeight: 600, border: 'none' }}
                >
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (active) => (
                <Tag
                    color={active ? 'success' : 'error'}
                    style={{ borderRadius: 6, fontSize: 10, background: active ? `${token.colorSuccess}20` : `${token.colorError}20`, border: 'none' }}
                >
                    {active ? 'LIVE' : 'CLOSED'}
                </Tag>
            ),
        },
        {
            title: 'ACTION',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Form">
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            icon={<EditOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(record);
                            }}
                            className="icon-glow"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete the form?"
                        description="This will delete the form and all its responses."
                        onConfirm={(e) => {
                            e.stopPropagation();
                            handleDelete(record._id);
                        }}
                        onCancel={(e) => e.stopPropagation()}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            danger
                            icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                    <Button
                        type="primary"
                        size="small"
                        shape="round"
                        icon={<BarChartOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(record);
                        }}
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '0 16px',
                            background: token.colorPrimary,
                            border: 'none',
                            boxShadow: `0 4px 10px ${token.colorPrimary}40`
                        }}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                className="glass-premium"
                title={
                    <Space size="middle">
                        <div className="flex-center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white' }}>
                            <FormOutlined style={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Form Management</Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>Manage interactive employee feedback</Text>
                        </div>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingForm(null);
                            setIsCreatorVisible(true);
                        }}
                        style={{
                            borderRadius: 12,
                            fontWeight: 700,
                            height: 40,
                            padding: '0 24px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        Create New
                    </Button>
                }
                style={{ borderRadius: 24, overflow: 'hidden', border: 'none' }}
                styles={{ body: { padding: '0px' } }}
            >
                <Table
                    columns={columns}
                    dataSource={forms}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 5, simple: true }}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        style: {
                            cursor: 'pointer',
                            background: selectedRowKey === record._id ? `${token.colorPrimary}15` : 'transparent',
                            transition: 'all 0.3s'
                        }
                    })}
                    className="premium-table"
                    size="middle"
                />

                <FormCreator
                    visible={isCreatorVisible}
                    initialData={editingForm}
                    onCancel={() => {
                        setIsCreatorVisible(false);
                        setEditingForm(null);
                    }}
                    onSuccess={() => {
                        setIsCreatorVisible(false);
                        setEditingForm(null);
                        fetchForms();
                    }}
                />
            </Card>
        </motion.div>
    );
};

export default FormManager;
