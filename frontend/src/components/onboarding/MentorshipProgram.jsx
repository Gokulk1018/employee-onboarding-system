import React from 'react';
import { Typography, List, Avatar, Button, Tag, theme } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const mentors = [
    { name: 'Dr. Emily Chen', role: 'Principle Engineer', mentee: 'You', status: 'Active' },
    { name: 'Sarah Jenkins', role: 'Senior Designer', mentee: 'Alice Smith', status: 'Scheduled' },
];

const MentorshipProgram = () => {
    const { token } = theme.useToken();

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Mentorship</Title>
                <Button type="link" size="small">Find Mentor</Button>
            </div>

            <List
                itemLayout="horizontal"
                dataSource={mentors}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item style={{ borderBottom: `1px solid var(--border-color)` }}>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} size="large" style={{ border: `2px solid ${token.colorPrimary}` }} />}
                                title={<Text strong style={{ color: 'var(--text-primary)' }}>{item.name}</Text>}
                                description={<div style={{ color: 'var(--text-secondary)' }}>{item.role}</div>}
                            />
                            <div style={{ textAlign: 'right' }}>
                                <Tag color={item.status === 'Active' ? 'green' : 'blue'}>{item.status}</Tag>
                            </div>
                        </List.Item>
                    </motion.div>
                )}
            />
            <Button type="dashed" block style={{ marginTop: 16 }} icon={<ArrowRightOutlined />}>View All Sessions</Button>
        </div>
    );
};

export default MentorshipProgram;
