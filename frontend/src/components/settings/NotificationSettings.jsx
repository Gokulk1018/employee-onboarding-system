import React from 'react';
import { Card, Typography, Switch, List, theme } from 'antd';
import { BellOutlined, MailOutlined, SlackOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotificationSettings = () => {
    const { token } = theme.useToken();

    const data = [
        {
            title: 'Email Notifications',
            description: 'Receive daily summaries and critical alerts via email',
            icon: <MailOutlined />,
            defaultChecked: true
        },
        {
            title: 'Push Notifications',
            description: 'Receive real-time alerts on your desktop',
            icon: <BellOutlined />,
            defaultChecked: true
        },
        {
            title: 'Slack Integration',
            description: 'Post updates to the #team-updates channel',
            icon: <SlackOutlined />,
            defaultChecked: false
        },
    ];

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-primary)' }}>Notifications</Title>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        actions={[<Switch defaultChecked={item.defaultChecked} />]}
                        style={{ padding: '16px 0', borderBlockEnd: '1px solid var(--border-color)' }}
                    >
                        <List.Item.Meta
                            avatar={
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    background: 'var(--bg-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: token.colorPrimary,
                                    fontSize: 20
                                }}>
                                    {item.icon}
                                </div>
                            }
                            title={<Text strong style={{ color: 'var(--text-primary)' }}>{item.title}</Text>}
                            description={<Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.description}</Text>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default NotificationSettings;
