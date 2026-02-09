import React from 'react';
import { List, Avatar, Typography, Tag, Button, theme } from 'antd';
import { LikeOutlined, TrophyTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const data = [
    {
        id: 1,
        sender: 'Sarah Jenkins',
        receiver: 'John Doe',
        message: 'Great help with the new release deployment!',
        category: 'Teamwork',
        time: '2 hours ago',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        likes: 12
    },
    {
        id: 2,
        sender: 'Mike Johnson',
        receiver: 'Jane Smith',
        message: 'Innovative solution for the client issue.',
        category: 'Innovation',
        time: '5 hours ago',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        likes: 8
    },
    {
        id: 3,
        sender: 'Emily Davids',
        receiver: 'Team Alpha',
        message: 'Crushed the Q3 goals ahead of schedule!',
        category: 'Excellence',
        time: '1 day ago',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        receiverAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TA',
        likes: 24
    },
];

const RecognitionFeed = () => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Recognition Feed</Title>
                <Button type="primary" icon={<TrophyTwoTone twoToneColor="#fcd34d" />} ghost>Give Kudus</Button>
            </div>

            <List
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item style={{ padding: '16px 0', borderBlockEnd: `1px solid ${token.colorBorder}` }}>
                            <div className="flex-between" style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar.Group max={{ count: 2 }} size="small">
                                        <Avatar src={item.senderAvatar} style={{ border: `2px solid ${token.colorBgContainer}` }} />
                                        <Avatar src={item.receiverAvatar} style={{ border: `2px solid ${token.colorBgContainer}` }} />
                                    </Avatar.Group>
                                    <div>
                                        <Text strong style={{ color: token.colorText }}>{item.sender}</Text>
                                        <Text style={{ color: token.colorTextSecondary, margin: '0 4px' }}>to</Text>
                                        <Text strong style={{ color: token.colorText }}>{item.receiver}</Text>
                                    </div>
                                </div>
                                <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>{item.time}</Text>
                            </div>

                            <div style={{
                                background: token.colorBgLayout, // Was var(--bg-primary)
                                padding: 16,
                                borderRadius: 12,
                                marginBottom: 12,
                                border: `1px solid ${token.colorBorder}`
                            }}>
                                <div style={{ fontSize: 15, color: token.colorText, marginBottom: 12, fontStyle: 'italic' }}>
                                    "{item.message}"
                                </div>
                                <div className="flex-between">
                                    <Tag color={item.category === 'Teamwork' ? 'blue' : item.category === 'Innovation' ? 'purple' : 'gold'} style={{ borderRadius: 12, marginRight: 0 }}>
                                        #{item.category}
                                    </Tag>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <Button type="text" size="small" icon={<LikeOutlined />} style={{ color: token.colorTextSecondary }}>
                                    {item.likes} Likes
                                </Button>
                                <Button type="text" size="small" style={{ color: token.colorTextSecondary }}>
                                    Comment
                                </Button>
                            </div>
                        </List.Item>
                    </motion.div>
                )}
            />
        </div>
    );
};

export default RecognitionFeed;
