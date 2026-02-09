import React, { useState } from 'react';
import { Typography, Row, Col, Button, Table, Tag, theme } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import OnboardingStepper from '../components/onboarding/OnboardingStepper';
import OnboardingDocuments from '../components/onboarding/OnboardingDocuments';
import OfferDrawer from '../components/onboarding/OfferDrawer';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const offersData = [
    { key: 1, name: 'Sarah Jenkins', role: 'Senior Designer', status: 'Accepted', date: '2023-11-15' },
    { key: 2, name: 'Tom Wilson', role: 'Frontend Dev', status: 'Sent', date: '2023-11-18' },
    { key: 3, name: 'Amy Lee', role: 'Product Manager', status: 'Draft', date: '2023-11-20' },
];

const Onboarding = () => {
    const { token } = theme.useToken();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const columns = [
        {
            title: 'Candidate',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</span>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = 'default';
                let bg = 'rgba(0,0,0,0.05)';
                if (status === 'Accepted') { color = 'success'; bg = `${token.colorSuccess}15`; }
                if (status === 'Sent') { color = 'processing'; bg = `${token.colorInfo}15`; }
                return (
                    <Tag bordered={false} color={color} style={{ borderRadius: 12, background: bg, fontWeight: 500 }}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button type="text" icon={<FileTextOutlined />} size="small">View Offer</Button>
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1600, margin: '0 auto' }}
            >
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }} className="text-gradient">Onboarding & Offers</Title>
                        <div style={{ color: 'var(--text-secondary)' }}>Manage offers and employee onboarding process</div>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)} size="large">Create Offer</Button>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-primary)' }}>Recent Offers</Title>
                            <Table
                                dataSource={offersData}
                                columns={columns}
                                pagination={false}
                                className="glass-table"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <OnboardingDocuments />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <OnboardingStepper />
                        </motion.div>
                    </Col>
                </Row>

                <OfferDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            </motion.div>
        </PageContainer>
    );
};

export default Onboarding;
