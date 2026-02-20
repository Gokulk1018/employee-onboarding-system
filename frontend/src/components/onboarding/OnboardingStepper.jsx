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
    CloseCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';

const OnboardingStepper = ({ candidateData }) => {
    const { token } = theme.useToken();

    const offerStatus = candidateData?.rawStatus || candidateData?.status;
    const onboardingStep = candidateData?.onboardingStep;

    // Calculate current step based on candidate status
    const getOnboardingState = () => {
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
            baseIcon: <CheckCircleOutlined />,
            description: (candidateData?.status === 'DECLINED' || candidateData?.status === 'Rejected')
                ? 'Offer Rejected'
                : (offerStatus === 'Accepted' || offerStatus === 'OFFER_ACCEPTED' || onboardingStep) ? (candidateData?.date || 'Accepted') : 'Awaiting response'
        },
        {
            title: 'Documentation',
            baseIcon: <SolutionOutlined />,
            description: state.step > 1 ? 'Documents verified' : (state.step === 1 ? 'Pending verification' : 'Not started')
        },
        {
            title: 'IT Setup',
            baseIcon: <LaptopOutlined />,
            description: state.step > 2 ? 'Completed' : 'Laptop configuration'
        },
        {
            title: 'Orientation',
            baseIcon: <TeamOutlined />,
            description: candidateData?.joiningDate ? `Scheduled for ${candidateData.joiningDate}` : (state.step > 3 ? 'Completed' : 'TBD')
        },
        {
            title: 'Ready (Day 1)',
            baseIcon: <SmileOutlined />,
            description: 'First day'
        }
    ];

    const getStepIcon = (index) => {
        if (index < state.step) return <CheckCircleOutlined />;
        if (index === state.step) {
            if (state.status === 'error') return <CloseCircleOutlined />;
            if (state.status === 'process') return <SyncOutlined spin />;
            if (state.status === 'wait') return <ClockCircleOutlined />;
        }
        return steps[index].baseIcon;
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
                current={state.step}
                status={state.status}
                items={steps.map((step, index) => ({
                    ...step,
                    icon: getStepIcon(index),
                    status: (index === state.step) ? state.status : (index < state.step ? 'finish' : 'wait'),
                    description: <span style={{ color: token.colorTextSecondary }}>{step.description}</span>
                }))}
            />


        </div>
    );
};

export default OnboardingStepper;
