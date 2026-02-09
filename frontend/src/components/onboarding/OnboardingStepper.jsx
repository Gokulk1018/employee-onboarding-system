import React from 'react';
import { Steps, Card, Typography, theme } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined, CheckCircleOutlined } from '@ant-design/icons';

const OnboardingStepper = ({ current = 1 }) => {
    const { token } = theme.useToken();
    return (
        <Card bordered={false} style={{ borderRadius: 16 }}>
            <Typography.Title level={5}>Onboarding Progress: Sarah Jenkins</Typography.Title>
            <Steps
                current={current}
                items={[
                    {
                        title: 'Offer Accepted',
                        status: 'finish',
                        icon: <CheckCircleOutlined />,
                        description: 'Nov 20, 2023'
                    },
                    {
                        title: 'Documentation',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                        description: 'Documents verified',
                    },
                    {
                        title: 'IT Setup',
                        status: 'process',
                        icon: <LoadingOutlined />,
                        description: 'Laptop configuration',
                    },
                    {
                        title: 'Orientation',
                        status: 'wait',
                        icon: <UserOutlined />,
                        description: 'Scheduled for Dec 1',
                    },
                    {
                        title: 'Ready',
                        status: 'wait',
                        icon: <SmileOutlined />,
                        description: 'Day 1',
                    },
                ]}
            />
        </Card>
    );
};

export default OnboardingStepper;
