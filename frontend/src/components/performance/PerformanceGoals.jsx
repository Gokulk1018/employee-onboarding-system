import React from 'react';
import { List, Avatar, Progress, Typography, theme, Button, Tag } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const data = [
    { name: 'John Doe', goal: 'Complete Project X Migration', progress: 80, dueDate: 'Nov 30', priority: 'High' },
    { name: 'Jane Smith', goal: 'Increase sales by 10% in Q4', progress: 60, dueDate: 'Dec 15', priority: 'Medium' },
    { name: 'Mike Johnson', goal: 'Learn React Native for Mobile App', progress: 30, dueDate: 'Dec 31', priority: 'Low' },
    { name: 'Sarah Wilson', goal: 'Onboard 5 new team members', progress: 100, dueDate: 'Oct 31', priority: 'High', status: 'Completed' },
];

const PerformanceGoals = () => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Team Goals Progress</Title>
                <Button icon={<PlusOutlined />}>Add Goal</Button>
            </div>
            <List
                dataSource={data}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item
                            actions={[<Button type="text" icon={<MoreOutlined />} key="more" />]}
                            style={{
                                padding: '16px 0',
                                borderBlockEnd: '1px solid var(--border-color)'
                            }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name.replace(' ', '')}`} size="large" style={{ border: '2px solid var(--bg-secondary)' }} />}
                                title={
                                    <div className="flex-between">
                                        <Text strong style={{ color: 'var(--text-primary)' }}>{item.name}</Text>
                                        <Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green'}>{item.priority}</Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ color: 'var(--text-secondary)', marginBottom: 8, marginTop: 4 }}>{item.goal}</div>
                                        <div className="flex-between" style={{ gap: 16 }}>
                                            <Progress
                                                percent={item.progress}
                                                size="small"
                                                strokeColor={item.progress === 100 ? token.colorSuccess : token.colorPrimary}
                                                trailColor="rgba(0,0,0,0.05)"
                                            />
                                            <div style={{ minWidth: 60, textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>Due {item.dueDate}</div>
                                        </div>
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

export default PerformanceGoals;
