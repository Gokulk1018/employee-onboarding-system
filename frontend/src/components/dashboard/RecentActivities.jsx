import React from 'react';
import { List, Avatar, Card, Typography, Tag, theme } from 'antd';
import { UserOutlined, FileDoneOutlined, TrophyOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const data = [
    {
        title: 'New employee onboarded',
        description: 'Sarah Jenkins joined the Design team',
        time: '2 hours ago',
        icon: <UserOutlined />,
        color: '#3b82f6',
    },
    {
        title: 'Performance review completed',
        description: 'Michael Chen completed his Q1 review',
        time: '4 hours ago',
        icon: <FileDoneOutlined />,
        color: '#10b981',
    },
    {
        title: 'New recognition awarded',
        description: 'Emma awarded "Star Performer" to David',
        time: '5 hours ago',
        icon: <TrophyOutlined />,
        color: '#f59e0b',
    },
    {
        title: 'Leave request approved',
        description: 'James Wilson\'s leave for next week approved',
        time: '1 day ago',
        icon: <FileDoneOutlined />,
        color: '#6366f1',
    },
];

const RecentActivities = () => {
    const { token } = theme.useToken();
    return (
        <Card
            title={<Title level={4} style={{ margin: 0 }}>Recent Activities</Title>}
            bordered={false}
            style={{ borderRadius: 16, height: '100%' }}
        >
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0', borderBlockEnd: `1px solid ${token.colorSplit}` }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={item.icon}
                                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                                    size="large"
                                />
                            }
                            title={<Text strong>{item.title}</Text>}
                            description={
                                <div>
                                    <div>{item.description}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecentActivities;
