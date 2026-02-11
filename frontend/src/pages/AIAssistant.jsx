import React from 'react';
import { Typography, Input, Card, List, Avatar } from 'antd';
import { UserOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const AIAssistant = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <Typography.Title level={2}>AI Assistant</Typography.Title>
            <Card
                variant="borderless"
                style={{ flex: 1, borderRadius: 16, display: 'flex', flexDirection: 'column' }}
                styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { title: 'Hello! I am your HR Assistant. How can I help you today?', isAi: true },
                        { title: 'How many leave days do I have left?', isAi: false },
                        { title: 'You have 12 annual leave days remaining.', isAi: true },
                    ]}
                    renderItem={item => (
                        <List.Item style={{ justifyContent: item.isAi ? 'flex-start' : 'flex-end', border: 'none' }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: item.isAi ? 'row' : 'row-reverse',
                                alignItems: 'center',
                                gap: 12,
                                maxWidth: '70%',
                            }}>
                                <Avatar icon={item.isAi ? <RobotOutlined /> : <UserOutlined />} style={{ backgroundColor: item.isAi ? '#6366f1' : '#f59e0b' }} />
                                <div style={{
                                    background: item.isAi ? '#f1f5f9' : '#e0e7ff',
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    borderTopLeftRadius: item.isAi ? 0 : 12,
                                    borderTopRightRadius: item.isAi ? 12 : 0,
                                }}>
                                    {item.title}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
                <Input suffix={<SendOutlined />} placeholder="Type a message..." size="large" style={{ marginTop: 16 }} />
            </Card>
        </motion.div>
    );
};
export default AIAssistant;
