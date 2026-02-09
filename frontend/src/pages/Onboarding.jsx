import React, { useState } from 'react';
import { Typography, Row, Col, Button, Table, Tag, theme, Input, Select, Space, Dropdown, message } from 'antd';
import {
    PlusOutlined,
    FileTextOutlined,
    SearchOutlined,
    MailOutlined,
    DownloadOutlined,
    CloseCircleOutlined,
    MoreOutlined
} from '@ant-design/icons';
import OnboardingStepper from '../components/onboarding/OnboardingStepper';
import OnboardingDocuments from '../components/onboarding/OnboardingDocuments';
import OfferDrawer from '../components/onboarding/OfferDrawer';
import MentorshipProgram from '../components/onboarding/MentorshipProgram';
import HRNotes from '../components/onboarding/HRNotes';

import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const initialOffersData = [
    { key: 1, name: 'Sarah Jenkins', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', role: 'Senior Designer', status: 'Accepted', date: '2023-11-15', joiningDate: 'Dec 1, 2023' },
    { key: 2, name: 'Tom Wilson', email: 'tom.w@email.com', phone: '+1 (555) 234-5678', role: 'Frontend Dev', status: 'Sent', date: '2023-11-18', joiningDate: 'Dec 5, 2023' },
    { key: 3, name: 'Amy Lee', email: 'amy.l@email.com', phone: '+1 (555) 345-6789', role: 'Product Manager', status: 'Draft', date: '2023-11-20', joiningDate: 'Dec 10, 2023' },
    { key: 4, name: 'John Smith', email: 'john.s@email.com', phone: '+1 (555) 456-7890', role: 'Backend Dev', status: 'Sent', date: '2023-11-22', joiningDate: 'Dec 8, 2023' },
];

const Onboarding = () => {
    const { token } = theme.useToken();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [offersData, setOffersData] = useState(initialOffersData);
    const [selectedCandidate, setSelectedCandidate] = useState(initialOffersData[0]);

    // Filter offers based on search and status
    const filteredOffers = offersData.filter(offer => {
        const matchesSearch = offer.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'All' || offer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOfferAction = (action, record) => {
        switch (action) {
            case 'resend':
                message.success(`Offer resent to ${record.name}`);
                break;
            case 'download':
                message.success(`Downloading offer letter for ${record.name}`);
                break;
            case 'cancel':
                message.warning(`Offer cancelled for ${record.name}`);
                setOffersData(offersData.filter(offer => offer.key !== record.key));
                break;
            case 'view':
                setSelectedCandidate(record);
                message.info(`Viewing offer for ${record.name}`);
                break;
            default:
                break;
        }
    };

    const getActionMenu = (record) => ({
        items: [
            {
                key: 'resend',
                label: 'Resend Offer',
                icon: <MailOutlined />,
                disabled: record.status === 'Draft',
                onClick: () => handleOfferAction('resend', record)
            },
            {
                key: 'download',
                label: 'Download Offer Letter',
                icon: <DownloadOutlined />,
                onClick: () => handleOfferAction('download', record)
            },
            {
                type: 'divider'
            },
            {
                key: 'cancel',
                label: 'Cancel Offer',
                icon: <CloseCircleOutlined />,
                danger: true,
                onClick: () => handleOfferAction('cancel', record)
            }
        ]
    });

    const columns = [
        {
            title: 'Candidate',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 600, color: token.colorText }}>{text}</span>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <span style={{ color: token.colorTextSecondary }}>{text}</span>
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
                if (status === 'Draft') { color = 'default'; bg = `${token.colorTextSecondary}15`; }
                return (
                    <Tag bordered={false} color={color} style={{ borderRadius: 12, background: bg, fontWeight: 500 }}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Offer Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span style={{ color: token.colorTextSecondary }}>{text}</span>
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FileTextOutlined />}
                        size="small"
                        onClick={() => handleOfferAction('view', record)}
                    >
                        View Offer
                    </Button>
                    <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                </Space>
            )
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
                        <Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">
                            Onboarding & Offers
                        </Title>
                        <div style={{ color: token.colorTextSecondary }}>
                            Manage offers and employee onboarding process
                        </div>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)} size="large">
                        Create Offer
                    </Button>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                            <Title level={4} style={{ marginTop: 0, marginBottom: 16, color: token.colorText }}>
                                Recent Offers
                            </Title>

                            {/* Search and Filter */}
                            <Space style={{ marginBottom: 16, width: '100%' }} size="middle">
                                <Input
                                    placeholder="Search by candidate name"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 250 }}
                                    allowClear
                                />
                                <Select
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    style={{ width: 150 }}
                                >
                                    <Select.Option value="All">All Status</Select.Option>
                                    <Select.Option value="Draft">Draft</Select.Option>
                                    <Select.Option value="Sent">Sent</Select.Option>
                                    <Select.Option value="Accepted">Accepted</Select.Option>
                                </Select>
                            </Space>

                            <Table
                                dataSource={filteredOffers}
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                                className="glass-table"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <OnboardingDocuments />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <HRNotes />
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <OnboardingStepper candidateData={selectedCandidate} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <MentorshipProgram />
                        </motion.div>
                    </Col>
                </Row>

                <OfferDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            </motion.div>
        </PageContainer>
    );
};

export default Onboarding;
