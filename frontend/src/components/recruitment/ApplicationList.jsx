import React from 'react';
import { List, Avatar, Tag, Button, Space, Typography, theme } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const data = [
    {
        name: 'Michael Scott',
        role: 'Regional Manager',
        status: 'Interview Scheduled',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        date: '2023-11-20',
    },
    {
        name: 'Dwight Schrute',
        role: 'Assistant to the Regional Manager',
        status: 'Reviewing',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dwight',
        date: '2023-11-21',
    },
    {
        name: 'Jim Halpert',
        role: 'Sales Representative',
        status: 'Offer Extended',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jim',
        date: '2023-11-22',
    },
];

const ApplicationList = () => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ padding: 24, marginTop: 24 }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Recent Applications</Title>
                <Button type="text" style={{ color: 'var(--accent-primary)' }}>View All</Button>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item
                            actions={[
                                <Button type="text" icon={<EyeOutlined />} key="view" />,
                                <Button type="text" icon={<CheckOutlined style={{ color: token.colorSuccess }} />} key="approve" />,
                                <Button type="text" icon={<CloseOutlined style={{ color: token.colorError }} />} key="reject" />
                            ]}
                            className="hover:bg-white/5"
                            style={{
                                padding: '16px 0',
                                borderBlockEnd: '1px solid var(--border-color)',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} shape="square" size="large" style={{ borderRadius: 8 }} />}
                                title={
                                    <Space>
                                        <Text strong style={{ color: 'var(--text-primary)' }}>{item.name}</Text>
                                        <Tag style={{ borderRadius: 12 }}>{item.role}</Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={2}>
                                        <Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Applied: {item.date}</Text>
                                        <Tag
                                            color={
                                                item.status === 'Offer Extended' ? 'success' :
                                                    item.status === 'Reviewing' ? 'processing' : 'warning'
                                            }
                                            bordered={false}
                                        >
                                            {item.status}
                                        </Tag>
                                    </Space>
                                }
                            />
                        </List.Item>
                    </motion.div>
                )}
            />
        </div>
    );
};

export default ApplicationList;
