import React from 'react';
import { List, Avatar, Tag, Button, Card, Typography, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

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
    return (
        <Card title="Recent Applications" bordered={false} style={{ borderRadius: 16, marginTop: 24 }}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />} key="approve" />,
                            <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />} key="reject" />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                            title={<Space>{item.name} <Tag>{item.role}</Tag></Space>}
                            description={
                                <Space>
                                    <span>Applied: {item.date}</span>
                                    <Tag
                                        color={
                                            item.status === 'Offer Extended' ? 'green' :
                                                item.status === 'Reviewing' ? 'blue' : 'orange'
                                        }
                                    >
                                        {item.status}
                                    </Tag>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ApplicationList;
