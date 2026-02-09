import React from 'react';
import { Steps, Typography, theme, Button, Tag, Avatar } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PerformanceReviews = () => {
    const { token } = theme.useToken();

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Review Cycle: Q4 2023</Title>
                <Tag color="processing">In Progress</Tag>
            </div>

            <div style={{ marginBottom: 24 }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                    <Text style={{ color: 'var(--text-secondary)' }}>Timeline</Text>
                    <Text strong style={{ color: token.colorPrimary }}>2 Weeks Remaining</Text>
                </div>
                <div style={{
                    height: 8,
                    background: 'var(--bg-primary)',
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
                        icon: <ClockCircleOutlined style={{ color: 'var(--text-secondary)' }} />,
                    },
                    {
                        title: 'Final Discussion',
                        description: 'To be scheduled',
                        icon: <ClockCircleOutlined style={{ color: 'var(--text-secondary)' }} />,
                    },
                ]}
            />

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: 'var(--text-primary)' }}>Pending Reviews for You</Text>
                <div className="flex-between" style={{
                    padding: 12,
                    background: 'var(--bg-primary)',
                    borderRadius: 12,
                    border: '1px solid var(--border-color)'
                }}>
                    <div className="flex-center" style={{ gap: 12 }}>
                        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" />
                        <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Bob Smith</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Peer Review</div>
                        </div>
                    </div>
                    <Button type="primary" size="small">Start</Button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviews;
