import React from 'react';
import { List, Typography, theme, Button, Avatar } from 'antd';
import { UserAddOutlined, TeamOutlined, DollarCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const TodayFocus = ({ data, loading }) => {
    const { token } = theme.useToken();

    const items = [
        {
            title: 'Onboardings Today',
            description: `${data?.onboardings || 0} new candidates joining today`,
            icon: <UserAddOutlined />,
            color: '#10b981',
            count: data?.onboardings || 0
        },
        {
            title: 'Active Jobs',
            description: `${data?.activeJobs || 0} open positions to fill`,
            icon: <TeamOutlined />,
            color: '#3b82f6',
            count: data?.activeJobs || 0
        },
        {
            title: 'Payroll Due',
            description: `${data?.payrollDue || 0} pending transactions`,
            icon: <DollarCircleOutlined />,
            color: '#f59e0b',
            count: data?.payrollDue || 0
        }
    ];

    return (
        <div className="glass-card" style={{ height: '100%', padding: 24, borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Today's Focus</Title>
                <Button type="text" style={{ color: token.colorPrimary }}>See Schedule <ArrowRightOutlined /></Button>
            </div>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
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
                                    <div style={{ color: token.colorTextSecondary }}>
                                        {item.description}
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

export default TodayFocus;
