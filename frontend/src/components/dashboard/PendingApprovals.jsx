import React from 'react';
import { List, Avatar, Typography, theme, Button, Tag } from 'antd';
import { FileSearchOutlined, MailOutlined, CarryOutOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const PendingApprovals = ({ data, loading }) => {
    const { token } = theme.useToken();

    const items = [
        {
            title: 'Leave Requests',
            count: data?.leaveRequests || 0,
            icon: <CarryOutOutlined />,
            color: '#f59e0b',
        },
        {
            title: 'Offer Letters',
            count: data?.offerLetters || 0,
            icon: <MailOutlined />,
            color: '#7c3aed',
        },
        {
            title: 'Document Verification',
            count: data?.documentVerification || 0,
            icon: <FileSearchOutlined />,
            color: '#3b82f6',
        }
    ];

    return (
        <div className="glass-card" style={{ height: '100%', padding: 24, borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Pending Approvals</Title>
                <Button type="text" style={{ color: token.colorPrimary }}>View All <ArrowRightOutlined /></Button>
            </div>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item
                            style={{
                                padding: '16px 0',
                                borderBlockEnd: index === items.length - 1 ? 'none' : `1px solid ${token.colorBorder}`,
                            }}
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
                                    <div className="flex-between">
                                        <Text style={{ color: token.colorTextSecondary }}>Requires your review</Text>
                                        <Tag color={item.count > 0 ? 'warning' : 'default'} style={{ borderRadius: 12 }}>
                                            {item.count} Pending
                                        </Tag>
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

export default PendingApprovals;
