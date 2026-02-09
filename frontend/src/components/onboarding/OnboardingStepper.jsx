import React, { useState } from 'react';
import { Steps, Typography, Button, Space, Card, Descriptions, theme, message } from 'antd';
import {
    UserOutlined,
    SolutionOutlined,
    LaptopOutlined,
    TeamOutlined,
    SmileOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const OnboardingStepper = ({ candidateData }) => {
    const { token } = theme.useToken();
    const [currentStep, setCurrentStep] = useState(2); // IT Setup in progress

    const steps = [
        {
            title: 'Offer Accepted',
            icon: <CheckCircleOutlined />,
            description: 'Nov 20, 2023'
        },
        {
            title: 'Documentation',
            icon: <SolutionOutlined />,
            description: 'Documents verified'
        },
        {
            title: 'IT Setup',
            icon: <LaptopOutlined />,
            description: 'Laptop configuration'
        },
        {
            title: 'Orientation',
            icon: <TeamOutlined />,
            description: 'Scheduled for Dec 1'
        },
        {
            title: 'Ready (Day 1)',
            icon: <SmileOutlined />,
            description: 'First day'
        }
    ];

    const handleMarkCompleted = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            message.success(`${steps[currentStep].title} marked as completed`);
        }
    };

    const handleMoveNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            message.success(`Moved to ${steps[currentStep + 1].title}`);
        }
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>
                Onboarding Progress
            </Typography.Title>

            {/* Candidate Info Card */}
            <Card
                size="small"
                style={{
                    marginBottom: 24,
                    background: `${token.colorPrimary}10`,
                    border: `1px solid ${token.colorPrimary}30`
                }}
            >
                <Descriptions column={1} size="small">
                    <Descriptions.Item
                        label={<span style={{ color: token.colorTextSecondary }}>Candidate</span>}
                    >
                        <strong style={{ color: token.colorText }}>{candidateData?.name || 'Sarah Jenkins'}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={<span style={{ color: token.colorTextSecondary }}>Email</span>}
                    >
                        <span style={{ color: token.colorText }}>{candidateData?.email || 'sarah.jenkins@email.com'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={<span style={{ color: token.colorTextSecondary }}>Phone</span>}
                    >
                        <span style={{ color: token.colorText }}>{candidateData?.phone || '+1 (555) 123-4567'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={<span style={{ color: token.colorTextSecondary }}>Role</span>}
                    >
                        <span style={{ color: token.colorText }}>{candidateData?.role || 'Senior Designer'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={<span style={{ color: token.colorTextSecondary }}>Joining Date</span>}
                    >
                        <span style={{ color: token.colorText }}>{candidateData?.joiningDate || 'Dec 1, 2023'}</span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Steps
                direction="vertical"
                current={currentStep}
                items={steps.map((step, index) => ({
                    ...step,
                    status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
                    description: <span style={{ color: token.colorTextSecondary }}>{step.description}</span>
                }))}
            />

            <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                <Button
                    type="primary"
                    block
                    onClick={handleMarkCompleted}
                    disabled={currentStep >= steps.length - 1}
                    icon={<CheckCircleOutlined />}
                >
                    Mark Step Completed
                </Button>
                <Button
                    block
                    onClick={handleMoveNext}
                    disabled={currentStep >= steps.length - 1}
                    icon={<ArrowRightOutlined />}
                >
                    Move to Next Step
                </Button>
            </Space>
        </div>
    );
};

export default OnboardingStepper;
