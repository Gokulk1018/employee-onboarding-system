import React from 'react';
import { Card, List, Avatar, Typography, theme } from 'antd';
import { TrophyOutlined, StarFilled } from '@ant-design/icons';

const { Text } = Typography;

const topEmployees = [
    { id: 1, name: 'Sarah Johnson', count: 24, avatar: 'SJ', color: '#f59e0b' },
    { id: 2, name: 'Michael Chen', count: 19, avatar: 'MC', color: '#10b981' },
    { id: 3, name: 'Emily Davis', count: 17, avatar: 'ED', color: '#3b82f6' },
    { id: 4, name: 'David Wilson', count: 15, avatar: 'DW', color: '#8b5cf6' },
    { id: 5, name: 'Lisa Anderson', count: 13, avatar: 'LA', color: '#ec4899' }
];

const TopRecognizedEmployees = () => {
    const { token } = theme.useToken();

    return (
        <Card
            title={
                <span>
                    <TrophyOutlined style={{ marginRight: 8, color: token.colorWarning }} />
                    Top Recognized Employees
                </span>
            }
            bordered={false}
            className="glass-card"
            style={{ height: '100%' }}
        >
            <List
                dataSource={topEmployees}
                renderItem={(item, index) => (
                    <List.Item style={{ padding: '12px 0' }}>
                        <List.Item.Meta
                            avatar={
                                <div style={{ position: 'relative' }}>
                                    <Avatar
                                        style={{
                                            backgroundColor: item.color,
                                            fontWeight: 600
                                        }}
                                        size={40}
                                    >
                                        {item.avatar}
                                    </Avatar>
                                    {index === 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -4,
                                            right: -4,
                                            background: token.colorWarning,
                                            borderRadius: '50%',
                                            width: 18,
                                            height: 18,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <TrophyOutlined style={{ fontSize: 10, color: '#fff' }} />
                                        </div>
                                    )}
                                </div>
                            }
                            title={
                                <Text strong style={{ color: token.colorText }}>
                                    {index + 1}. {item.name}
                                </Text>
                            }
                            description={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <StarFilled style={{ color: token.colorWarning, fontSize: 12 }} />
                                    <Text style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                                        {item.count} recognitions
                                    </Text>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TopRecognizedEmployees;
