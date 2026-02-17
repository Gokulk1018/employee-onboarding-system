import React from 'react';
import { Card, List, Avatar, Typography, Space, Tag, theme, Badge } from 'antd';
import { motion } from 'framer-motion';
import { MessageOutlined, FireOutlined, NotificationOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EngagementWall = () => {
    const { token } = theme.useToken();

    const feedItems = [
        {
            id: 1,
            type: 'announcement',
            user: 'HR Team',
            content: 'Welcome to our new Town Hall series! Join us this Friday.',
            time: '2 hours ago',
            tags: ['Official']
        },
        {
            id: 2,
            type: 'shoutout',
            user: 'John Doe',
            target: 'Jane Smith',
            content: 'A huge shoutout to Jane for leading the Q1 project transition so smoothly! 🚀',
            time: '5 hours ago',
            tags: ['Appreciation', 'Teamwork']
        },
        {
            id: 3,
            type: 'shoutout',
            user: 'Mike Ross',
            target: 'All Team',
            content: 'Great work everyone on hitting the 100% deployment target!',
            time: '1 day ago',
            tags: ['Achievement']
        }
    ];

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
            <div style={{ maxHeight: 500, overflowY: 'auto', padding: '12px' }}>
                <List
                    dataSource={feedItems}
                    renderItem={(item, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div style={{
                                padding: 16,
                                background: item.type === 'announcement' ? `${token.colorPrimary}10` : 'rgba(128, 128, 128, 0.05)',
                                borderRadius: 16,
                                marginBottom: 12,
                                border: `1px solid ${item.type === 'announcement' ? `${token.colorPrimary}20` : 'rgba(128, 128, 128, 0.1)'}`
                            }}>
                                <div className="flex-between" style={{ marginBottom: 8 }}>
                                    <Space>
                                        <Avatar size="small" style={{ backgroundColor: item.type === 'announcement' ? token.colorPrimary : '#a855f7' }}>
                                            {item.user[0]}
                                        </Avatar>
                                        <Text strong style={{ color: item.type === 'announcement' ? token.colorPrimary : token.colorText }}>
                                            {item.user}
                                            {item.target && <span style={{ fontWeight: 400, opacity: 0.6 }}> ➔ {item.target}</span>}
                                        </Text>
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                </div>
                                <Text style={{ display: 'block', color: token.colorText, marginBottom: 8, opacity: 0.85 }}>
                                    {item.content}
                                </Text>
                                <Space size={[0, 4]} wrap>
                                    {item.tags.map(tag => (
                                        <Tag key={tag} style={{
                                            borderRadius: 4,
                                            background: 'rgba(128, 128, 128, 0.08)',
                                            border: 'none',
                                            color: token.colorTextSecondary,
                                            fontSize: 10
                                        }}>
                                            #{tag}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>
                        </motion.div>
                    )}
                />
            </div>
            <div style={{ padding: 16, borderTop: `1px solid ${token.colorBorderSecondary}`, textAlign: 'center' }}>
                <Button type="link" icon={<MessageOutlined />} style={{ color: token.colorPrimary }}>Post a Shoutout</Button>
            </div>
        </Card>
    );
};

const Button = Typography.Button || (() => null); // Fallback if using custom button

export default EngagementWall;
