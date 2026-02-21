import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Typography, Space, Tag, theme, Badge, Input, Button, Modal, App } from 'antd';
import { motion } from 'framer-motion';
import { MessageOutlined, FireOutlined, SendOutlined } from '@ant-design/icons';
import { getWallResponses, replyToResponse } from '../../services/engagementService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const EngagementWall = () => {
    const { token } = theme.useToken();
    const { message: antMessage } = App.useApp();
    const userRole = localStorage.getItem('userRole');
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const fetchWallData = async () => {
        try {
            setLoading(true);
            const res = await getWallResponses();
            if (res.success) {
                setFeedItems(res.data);
            }
        } catch (error) {
            antMessage.error('Failed to load engagement wall');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallData();
    }, []);

    const handleOpenReply = (item) => {
        setSelectedResponse(item);
        setReplyText(item.hrReply || '');
        setReplyModalVisible(true);
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        try {
            setSubmittingReply(true);
            const res = await replyToResponse(selectedResponse._id, replyText);
            if (res.success) {
                antMessage.success('Reply sent successfully');
                setReplyModalVisible(false);
                fetchWallData();
            }
        } catch (error) {
            antMessage.error('Failed to send reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    return (
        <Card
            className="glass-premium"
            title={
                <Space>
                    <FireOutlined style={{ color: '#f97316' }} />
                    <Title level={4} style={{ margin: 0 }}>Engagement Wall</Title>
                </Space>
            }
            styles={{ body: { padding: 0 } }}
            style={{ borderRadius: 24, overflow: 'hidden', border: 'none', height: '100%' }}
        >
            <div style={{ maxHeight: 600, overflowY: 'auto', padding: '12px' }}>
                <List
                    loading={loading}
                    dataSource={feedItems}
                    renderItem={(item, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div style={{
                                padding: 16,
                                background: 'rgba(128, 128, 128, 0.05)',
                                borderRadius: 16,
                                marginBottom: 12,
                                border: '1px solid rgba(128, 128, 128, 0.1)'
                            }}>
                                <div className="flex-between" style={{ marginBottom: 8 }}>
                                    <Space>
                                        <Avatar
                                            size="small"
                                            src={item.employeeId?.avatar}
                                            style={{ backgroundColor: token.colorPrimary }}
                                        >
                                            {item.employeeId?.name?.[0]}
                                        </Avatar>
                                        <Text strong>
                                            {item.employeeId?.name}
                                            <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 11 }}> • {item.employeeId?.department}</span>
                                        </Text>
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(item.createdAt).fromNow()}</Text>
                                </div>
                                <Text style={{ display: 'block', color: token.colorText, marginBottom: 8, opacity: 0.85 }}>
                                    {item.message}
                                </Text>

                                {item.hrReply && (
                                    <div style={{
                                        marginTop: 12,
                                        padding: '8px 12px',
                                        background: `${token.colorPrimary}10`,
                                        borderRadius: 8,
                                        borderLeft: `3px solid ${token.colorPrimary}`
                                    }}>
                                        <Text strong style={{ fontSize: 11, color: token.colorPrimary }}>HR REPLY:</Text>
                                        <Text style={{ display: 'block', fontSize: 13, marginTop: 4 }}>{item.hrReply}</Text>
                                    </div>
                                )}

                                <div className="flex-between" style={{ marginTop: 12 }}>
                                    <Tag style={{ borderRadius: 4, background: 'rgba(128, 128, 128, 0.08)', border: 'none', color: token.colorTextSecondary, fontSize: 10 }}>
                                        #{item.formId?.category?.replace(/\s+/g, '')}
                                    </Tag>
                                    {userRole === 'hr' && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() => handleOpenReply(item)}
                                            icon={<MessageOutlined />}
                                        >
                                            {item.hrReply ? 'Edit Reply' : 'Reply'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                />
            </div>

            <Modal
                title="Reply to Feedback"
                open={replyModalVisible}
                onCancel={() => setReplyModalVisible(false)}
                footer={null}
                centered
                className="glass-modal"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">User Remark:</Text>
                    <div style={{ padding: 12, background: 'rgba(128, 128, 128, 0.05)', borderRadius: 8, marginTop: 8 }}>
                        <Text>"{selectedResponse?.message}"</Text>
                    </div>
                </div>
                <Input.TextArea
                    rows={4}
                    placeholder="Type your reply to the employee..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ borderRadius: 12 }}
                />
                <Button
                    type="primary"
                    block
                    icon={<SendOutlined />}
                    loading={submittingReply}
                    onClick={handleSendReply}
                    style={{ marginTop: 16, height: 44, borderRadius: 12 }}
                >
                    Send Reply
                </Button>
            </Modal>
        </Card>
    );
};

export default EngagementWall;
