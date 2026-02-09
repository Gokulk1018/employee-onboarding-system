import React from 'react';
import { List, Avatar, Card, Typography, Progress, theme } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

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
        <Card
            title={<Title level={4} style={{ margin: 0 }}>Top Performers</Title>}
            extra={<a href="#">View All</a>}
            bordered={false}
            style={{ borderRadius: 16, height: '100%' }}
        >
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} size="large" />}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong>{item.name}</Text>
                                    {index === 0 && <TrophyOutlined style={{ color: '#f59e0b' }} />}
                                </div>
                            }
                            description={
                                <div>
                                    <div>{item.role}</div>
                                    <Progress percent={item.score} size="small" strokeColor={token.colorPrimary} showInfo={false} />
                                    <div style={{ textAlign: 'right', fontSize: 12, color: token.colorTextSecondary }}>Score: {item.score}</div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TopPerformers;
