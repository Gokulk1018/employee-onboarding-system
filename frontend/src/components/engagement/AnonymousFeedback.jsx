import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Switch, Space, Typography, message, List, Tag, theme, Skeleton } from 'antd';
import { SendOutlined, UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { getFeedback, submitFeedback } from '../../services/engagementService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const AnonymousFeedback = () => {
    const { token } = theme.useToken();
    const [msg, setMsg] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentFeedback = async () => {
        setLoading(true);
        try {
            const res = await getFeedback();
            if (res.success) {
                setRecentFeedback(res.data);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentFeedback();
    }, []);

    const handleSubmit = async () => {
        if (!msg.trim()) {
            message.warning('Please enter your feedback');
            return;
        }

        try {
            const res = await submitFeedback({
                message: msg,
                isAnonymous
            });
            if (res.success) {
                message.success('Feedback submitted successfully');
                setMsg('');
                fetchRecentFeedback();
            }
        } catch (error) {
            message.error('Failed to submit feedback');
        }
    };

    return (
        <Card
            title="Anonymous Feedback Box"
            bordered={false}
            className="glass-card"
            style={{ borderRadius: 16, border: `1px solid ${token.colorBorder}` }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <TextArea
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    style={{ borderRadius: 8 }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Switch
                            checked={isAnonymous}
                            onChange={setIsAnonymous}
                            checkedChildren={<EyeInvisibleOutlined />}
                            unCheckedChildren={<UserOutlined />}
                        />
                        <Text style={{ fontSize: 13 }}>
                            {isAnonymous ? 'Truly Anonymous' : 'Named Feedback'}
                        </Text>
                    </Space>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                        shape="round"
                    >
                        Submit
                    </Button>
                </div>

                <div style={{ marginTop: 24 }}>
                    <Text strong style={{ fontSize: 16 }}>Recent Feedback</Text>
                    {loading ? (
                        <Skeleton active style={{ marginTop: 12 }} />
                    ) : (
                        <List
                            style={{ marginTop: 12 }}
                            dataSource={recentFeedback.slice(0, 5)}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '12px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                    <div style={{ width: '100%' }}>
                                        <Text style={{ display: 'block', marginBottom: 8 }}>{item.message}</Text>
                                        <div className="flex-between">
                                            {item.isAnonymous ? (
                                                <Tag icon={<EyeInvisibleOutlined />} color="default">Anonymous</Tag>
                                            ) : (
                                                <Tag icon={<UserOutlined />} color="blue">{item.senderId?.name || 'User'}</Tag>
                                            )}
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {dayjs(item.createdAt).format('MMM DD')}
                                            </Text>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Space>
        </Card>
    );
};

export default AnonymousFeedback;
