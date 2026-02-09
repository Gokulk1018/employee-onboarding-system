import React from 'react';
import { List, Avatar, Typography, theme, Button } from 'antd';
import { UserOutlined, FileDoneOutlined, TrophyOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const RecentActivities = () => {
    const { token } = theme.useToken();

    const data = [
        {
            title: 'New employee onboarded',
            description: 'Sarah Jenkins joined the Design team',
            time: '2 hours ago',
            icon: <UserOutlined />,
            color: token.colorInfo,
        },
        {
            title: 'Performance review completed',
            description: 'Michael Chen completed his Q1 review',
            time: '4 hours ago',
            icon: <FileDoneOutlined />,
            color: token.colorSuccess,
        },
        {
            title: 'New recognition awarded',
            description: 'Emma awarded "Star Performer" to David',
            time: '5 hours ago',
            icon: <TrophyOutlined />,
            color: token.colorWarning,
        },
        {
            title: 'Leave request approved',
            description: 'James Wilson\'s leave for next week approved',
            time: '1 day ago',
            icon: <FileDoneOutlined />,
            color: token.colorPrimary,
        },
    ];

    return (
        <div className="glass-card" style={{ height: '100%', padding: 24, borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Recent Activities</Title>
                <Button type="text" style={{ color: token.colorPrimary }}>View All <ArrowRightOutlined /></Button>
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
                            style={{
                                padding: '16px 0',
                                borderBlockEnd: `1px solid ${token.colorBorder}`,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            className="hover:bg-white/5"
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={item.icon}
                                        style={{
                                            backgroundColor: `${item.color}15`,
                                            color: item.color,
                                            border: `1px solid ${item.color}30`
                                        }}
                                        size="large"
                                    />
                                }
                                title={<Text strong style={{ color: token.colorText }}>{item.title}</Text>}
                                description={
                                    <div>
                                        <div style={{ color: token.colorTextSecondary, marginBottom: 4 }}>{item.description}</div>
                                        <Text style={{ fontSize: 12, color: token.colorTextSecondary, opacity: 0.7 }}>{item.time}</Text>
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

export default RecentActivities;
