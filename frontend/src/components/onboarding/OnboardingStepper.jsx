import React from 'react';
import { Steps, Typography, theme } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined, CheckCircleOutlined } from '@ant-design/icons';

const OnboardingStepper = ({ current = 1 }) => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>
                Onboarding Progress: <span style={{ color: token.colorPrimary }}>Sarah Jenkins</span>
            </Typography.Title>
            <Steps
                direction="vertical"
                current={current}
                items={[
                    {
                        title: 'Offer Accepted',
                        status: 'finish',
                        icon: <CheckCircleOutlined />,
                        description: <span style={{ color: token.colorTextSecondary }}>Nov 20, 2023</span>
                    },
                    {
                        title: 'Documentation',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                        description: <span style={{ color: token.colorTextSecondary }}>Documents verified</span>,
                    },
                    {
                        title: 'IT Setup',
                        status: 'process',
                        icon: <LoadingOutlined />,
                        description: <span style={{ color: token.colorTextSecondary }}>Laptop configuration</span>,
                    },
                    {
                        title: 'Orientation',
                        status: 'wait',
                        icon: <UserOutlined />,
                        description: <span style={{ color: token.colorTextSecondary }}>Scheduled for Dec 1</span>,
                    },
                    {
                        title: 'Ready',
                        status: 'wait',
                        icon: <SmileOutlined />,
                        description: <span style={{ color: token.colorTextSecondary }}>Day 1</span>,
                    },
                ]}
            />
        </div>
    );
};

export default OnboardingStepper;
