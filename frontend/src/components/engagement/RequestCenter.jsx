import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Space, Typography, theme, Modal, Form, Input, Select, List, Avatar, Badge, Tooltip, App } from 'antd';
import { PlusOutlined, MessageOutlined, CheckCircleOutlined, CloseCircleOutlined, CustomerServiceOutlined, UserOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getRequests, createRequest, updateRequest } from '../../services/engagementService';

const { Title, Text } = Typography;
const { Option } = Select;

const RequestCenter = () => {
    const { token } = theme.useToken();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [form] = Form.useForm();
    const [replyForm] = Form.useForm();
    const { message } = App.useApp();
    const userRole = localStorage.getItem('userRole');

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await getRequests();
            if (res.success) {
                setRequests(res.data);
            }
        } catch (error) {
            message.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleCreateRequest = async (values) => {
        try {
            const res = await createRequest(values);
            if (res.success) {
                message.success('Request submitted successfully');
                setIsCreateModalVisible(false);
                form.resetFields();
                fetchRequests();
            }
        } catch (error) {
            message.error('Failed to submit request');
        }
    };

    const handleUpdateRequest = async (id, status, hrReply) => {
        try {
            const res = await updateRequest(id, { status, hrReply });
            if (res.success) {
                message.success(`Request ${status || 'updated'} successfully`);
                setIsReplyModalVisible(false);
                replyForm.resetFields();
                fetchRequests();
            }
        } catch (error) {
            message.error('Failed to update request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return token.colorSuccess;
            case 'Declined': return token.colorError;
            default: return token.colorInfo;
        }
    };

    return (
        <Card
            className="glass-card"
            title={
                <Space>
                    <CustomerServiceOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                    <Title level={4} style={{ margin: 0 }}>Ticket Center</Title>
                </Space>
            }
            extra={userRole !== 'hr' && (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                    shape="round"
                >
                    New Ticket
                </Button>
            )}
            style={{ borderRadius: 24, minHeight: 600 }}
            styles={{ body: { padding: 0 } }}
        >
            <List
                loading={loading}
                dataSource={requests}
                className="premium-list"
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }} className="hover:bg-white/5">
                            <div className="flex-between" style={{ marginBottom: 12 }}>
                                <Space>
                                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }} />
                                    <div>
                                        <Text strong style={{ display: 'block' }}>{item.name}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{item.department}</Text>
                                    </div>
                                </Space>
                                <Tag color={getStatusColor(item.status)} style={{ borderRadius: 20, border: 'none', padding: '0 12px' }}>
                                    {item.status.toUpperCase()}
                                </Tag>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <Tag color="blue" size="small" style={{ marginBottom: 4 }}>{item.requestType}</Tag>
                                <Text style={{ display: 'block', fontSize: 13, color: token.colorTextSecondary }}>{item.message}</Text>
                            </div>

                            {item.hrReply && (
                                <div style={{
                                    background: `${token.colorSuccess}08`,
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    borderLeft: `3px solid ${token.colorSuccess}`,
                                    marginBottom: 12
                                }}>
                                    <Text style={{ fontSize: 12, fontWeight: 600, color: token.colorSuccess }}>HR Reply:</Text>
                                    <Text style={{ display: 'block', fontSize: 12 }}>{item.hrReply}</Text>
                                </div>
                            )}

                            {userRole === 'hr' && item.status === 'Pending' && (
                                <Space style={{ marginTop: 8 }}>
                                    <Tooltip title="Approve">
                                        <Button
                                            size="small"
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => handleUpdateRequest(item._id, 'Approved')}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Decline">
                                        <Button
                                            size="small"
                                            danger
                                            icon={<CloseCircleOutlined />}
                                            onClick={() => handleUpdateRequest(item._id, 'Declined')}
                                        />
                                    </Tooltip>
                                    <Button
                                        size="small"
                                        icon={<MessageOutlined />}
                                        onClick={() => {
                                            setSelectedRequest(item);
                                            setIsReplyModalVisible(true);
                                            replyForm.setFieldsValue({ hrReply: item.hrReply });
                                        }}
                                    >
                                        Reply
                                    </Button>
                                </Space>
                            )}
                        </div>
                    </motion.div>
                )}
            />

            {/* Create Request Modal */}
            <Modal
                title="Submit Support Request"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
                    <Form.Item name="requestType" label="Request Type" rules={[{ required: true }]}>
                        <Select placeholder="Select type">
                            <Option value="Network Issue">Network Issue</Option>
                            <Option value="System Access">System Access</Option>
                            <Option value="Salary Issue">Salary Issue</Option>
                            <Option value="Personal Query">Personal Query</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="message" label="Message / Reason" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="Describe your request in detail..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Reply Modal */}
            <Modal
                title="HR Reply"
                open={isReplyModalVisible}
                onCancel={() => setIsReplyModalVisible(false)}
                onOk={() => replyForm.submit()}
                destroyOnHidden
            >
                <Form form={replyForm} layout="vertical" onFinish={(v) => handleUpdateRequest(selectedRequest._id, null, v.hrReply)}>
                    <Form.Item name="hrReply" label="Reply Message" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="Type your response to the employee..." />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default RequestCenter;
