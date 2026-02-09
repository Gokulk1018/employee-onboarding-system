import React, { useState } from 'react';
import { Card, Input, Button, Switch, Space, Typography, message, List, Tag, theme } from 'antd';
import { SendOutlined, UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const AnonymousFeedback = () => {
    const { token } = theme.useToken();
    const [feedback, setFeedback] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [submittedFeedback, setSubmittedFeedback] = useState([
        { id: 1, text: 'Great team collaboration this month!', anonymous: false, author: 'John Doe', date: 'Nov 20' },
        { id: 2, text: 'Would like more flexible work hours.', anonymous: true, date: 'Nov 18' }
    ]);

    const handleSubmit = () => {
        if (!feedback.trim()) {
            message.warning('Please enter your feedback');
            return;
        }

        const newFeedback = {
            id: Date.now(),
            text: feedback,
            anonymous: isAnonymous,
            author: isAnonymous ? null : 'Current User',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };

        setSubmittedFeedback([newFeedback, ...submittedFeedback]);
        setFeedback('');
        message.success('Feedback submitted successfully');
    };

    return (
        <Card
            title="Anonymous Feedback Box"
            bordered={false}
            className="glass-card"
            style={{ height: '100%' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    style={{ background: token.colorBgContainer }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Switch
                            checked={isAnonymous}
                            onChange={setIsAnonymous}
                            checkedChildren={<EyeInvisibleOutlined />}
                            unCheckedChildren={<UserOutlined />}
                        />
                        <Text style={{ color: token.colorText }}>
                            {isAnonymous ? 'Anonymous' : 'Named'}
                        </Text>
                    </Space>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                    >
                        Submit Feedback
                    </Button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <Text strong style={{ color: token.colorText }}>Recent Feedback</Text>
                    <List
                        style={{ marginTop: 12 }}
                        dataSource={submittedFeedback.slice(0, 3)}
                        renderItem={(item) => (
                            <List.Item style={{ padding: '8px 0' }}>
                                <div style={{ width: '100%' }}>
                                    <Text style={{ color: token.colorText }}>{item.text}</Text>
                                    <div style={{ marginTop: 4 }}>
                                        {item.anonymous ? (
                                            <Tag icon={<EyeInvisibleOutlined />} color="default">Anonymous</Tag>
                                        ) : (
                                            <Tag icon={<UserOutlined />} color="blue">{item.author}</Tag>
                                        )}
                                        <Text style={{ fontSize: 12, color: token.colorTextSecondary, marginLeft: 8 }}>
                                            {item.date}
                                        </Text>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Space>
        </Card>
    );
};

export default AnonymousFeedback;
