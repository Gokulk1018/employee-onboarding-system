import React from 'react';
import { List, Avatar, Card, Typography, Tag } from 'antd';
import { LikeOutlined } from '@ant-design/icons';

const data = [
    {
        sender: 'Sarah Jenkins',
        receiver: 'John Doe',
        message: 'Great help with the new release deployment!',
        category: 'Teamwork',
        time: '2 hours ago',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    {
        sender: 'Mike Johnson',
        receiver: 'Jane Smith',
        message: 'Innovative solution for the client issue.',
        category: 'Innovation',
        time: '5 hours ago',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    },
];

const RecognitionFeed = () => {
    return (
        <Card title="Recent Recognitions" bordered={false} style={{ borderRadius: 16 }}>
            <List
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <Avatar.Group>
                                <Avatar src={item.senderAvatar} />
                                <Avatar src={item.receiverAvatar} />
                            </Avatar.Group>
                            <div>
                                <Typography.Text strong>{item.sender}</Typography.Text> recognized <Typography.Text strong>{item.receiver}</Typography.Text>
                            </div>
                        </div>
                        <Card
                            type="inner"
                            style={{ background: '#f8fafc', borderRadius: 12, border: 'none' }}
                            bodyStyle={{ padding: 12 }}
                        >
                            <div style={{ marginBottom: 8 }}>"{item.message}"</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Tag color="purple">{item.category}</Tag>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Typography.Text>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecognitionFeed;
