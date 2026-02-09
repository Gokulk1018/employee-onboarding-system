import React from 'react';
import { List, Avatar, Typography, Progress, theme, Button } from 'antd';
import { TrophyOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const data = [
    {
        name: 'Alice Johnson',
        role: 'Senior Developer',
        score: 98,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    },
    {
        name: 'Bob Smith',
        role: 'Product Manager',
        score: 95,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
    {
        name: 'Charlie Brown',
        role: 'UX Designer',
        score: 92,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    },
];

const TopPerformers = () => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ height: '100%', padding: 24 }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Top Performers</Title>
                <Button type="text" style={{ color: 'var(--accent-primary)' }}>View All <ArrowRightOutlined /></Button>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                    >
                        <List.Item
                            style={{ borderBlockEnd: '1px solid var(--border-color)', padding: '16px 0' }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{ position: 'relative' }}>
                                        <Avatar src={item.avatar} size={48} style={{ border: '2px solid var(--bg-secondary)' }} />
                                        {index === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                background: '#f59e0b',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: 12,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                <TrophyOutlined />
                                            </div>
                                        )}
                                    </div>
                                }
                                title={
                                    <div className="flex-between">
                                        <Text strong style={{ color: 'var(--text-primary)' }}>{item.name}</Text>
                                        <Text strong style={{ color: token.colorPrimary }}>{item.score}</Text>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{item.role}</div>
                                        <Progress
                                            percent={item.score}
                                            size="small"
                                            strokeColor={index === 0 ? '#f59e0b' : token.colorPrimary}
                                            showInfo={false}
                                            trailColor="rgba(0,0,0,0.05)"
                                        />
                                    </div>
                                }
                            />
                        </List.Item>
                    </motion.div>
                )}
            />
        </div>
    );
};

export default TopPerformers;
