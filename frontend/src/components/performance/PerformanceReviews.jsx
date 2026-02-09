import React from 'react';
import { Steps, Typography, theme, Button, Tag, Avatar } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PerformanceReviews = () => {
    const { token } = theme.useToken();

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Review Cycle: Q4 2023</Title>
                <Tag color="processing">In Progress</Tag>
            </div>

            <div style={{ marginBottom: 24 }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                    <Text style={{ color: token.colorTextSecondary }}>Timeline</Text>
                    <Text strong style={{ color: token.colorPrimary }}>2 Weeks Remaining</Text>
                </div>
                <div style={{
                    height: 8,
                    background: token.colorBgLayout,
                    borderRadius: 4,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '65%',
                        height: '100%',
                        background: `linear-gradient(90deg, ${token.colorPrimary}, ${token.colorInfo})`,
                        borderRadius: 4
                    }} />
                </div>
            </div>

            <Steps
                direction="vertical"
                current={1}
                items={[
                    {
                        title: 'Self Assessment',
                        description: 'Completed on Oct 15',
                        icon: <CheckCircleOutlined style={{ color: token.colorSuccess }} />,
                    },
                    {
                        title: 'Peer Review',
                        description: 'Pending inputs from 2 peers',
                        icon: <LoadingOutlined style={{ color: token.colorPrimary }} />,
                    },
                    {
                        title: 'Manager Review',
                        description: 'Scheduled for Nov 10',
                        icon: <ClockCircleOutlined style={{ color: token.colorTextSecondary }} />,
                    },
                    {
                        title: 'Final Discussion',
                        description: 'To be scheduled',
                        icon: <ClockCircleOutlined style={{ color: token.colorTextSecondary }} />,
                    },
                ]}
            />

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${token.colorBorder}` }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: token.colorText }}>Pending Reviews for You</Text>
                <div className="flex-between" style={{
                    padding: 12,
                    background: token.colorBgLayout,
                    borderRadius: 12,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    <div className="flex-center" style={{ gap: 12 }}>
                        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" />
                        <div>
                            <div style={{ fontWeight: 500, color: token.colorText }}>Bob Smith</div>
                            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>Peer Review</div>
                        </div>
                    </div>
                    <Button type="primary" size="small">Start</Button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviews;
