import React from 'react';
import { Steps, Typography, Button, Space, Card, Descriptions, theme, message } from 'antd';
import {
    UserOutlined,
    SolutionOutlined,
    LaptopOutlined,
    TeamOutlined,
    SmileOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const OnboardingStepper = ({ candidateData }) => {
    const { token } = theme.useToken();

    // Calculate current step based on candidate status
    const getOnboardingState = () => {
        const offerStatus = candidateData?.rawStatus || candidateData?.status;
        const onboardingStep = candidateData?.onboardingStep;

        // Handle Offer Stage
        if (offerStatus === 'DECLINED' || offerStatus === 'Rejected') {
            return { step: 0, status: 'error', desc: 'Offer declined by candidate' };
        }
        if (offerStatus === 'Sent') {
            return { step: 0, status: 'process', desc: 'Offer sent, awaiting response' };
        }
        if (offerStatus === 'Draft') {
            return { step: 0, status: 'wait', desc: 'Offer letter in preparation' };
        }

        // Handle active onboarding steps
        if (onboardingStep) {
            const stepMap = {
                'Offer Accepted': 0,
                'Documentation': 1,
                'IT Setup': 2,
                'Orientation': 3,
                'Ready': 4
            };
            const stepIndex = stepMap[onboardingStep] !== undefined ? stepMap[onboardingStep] : 0;
            return {
                step: stepIndex,
                status: 'process',
                desc: onboardingStep
            };
        }

        // Fallback for transition period or missing data
        if (offerStatus === 'Accepted' || offerStatus === 'OFFER_ACCEPTED') {
            return { step: 0, status: 'process', desc: 'Offer Accepted' };
        }

        return { step: 0, status: 'wait', desc: 'Awaiting offer' };
    };

    const state = getOnboardingState();
    // Removed local state to ensure updates from props are reflected immediately

    const steps = [
        {
            title: 'Offer Accepted',
            icon: state.step === 0 && state.status === 'error' ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
            description: (candidateData?.status === 'DECLINED' || candidateData?.status === 'Rejected')
                ? 'Offer Rejected'
                : (candidateData?.date || 'Awaiting response')
        },
        {
            title: 'Documentation',
            icon: <SolutionOutlined />,
            description: state.step > 1 ? 'Documents verified' : 'Pending verification'
        },
        {
            title: 'IT Setup',
            icon: <LaptopOutlined />,
            description: 'Laptop configuration'
        },
        {
            title: 'Orientation',
            icon: <TeamOutlined />,
            description: candidateData?.joiningDate ? `Scheduled for ${candidateData.joiningDate}` : 'TBD'
        },
        {
            title: 'Ready (Day 1)',
            icon: <SmileOutlined />,
            description: 'First day'
        }
    ];

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
                current={state.step}
                status={state.status}
                items={steps.map((step, index) => ({
                    ...step,
                    status: (index === state.step) ? state.status : (index < state.step ? 'finish' : 'wait'),
                    description: <span style={{ color: token.colorTextSecondary }}>{step.description}</span>
                }))}
            />


        </div>
    );
};

export default OnboardingStepper;
