import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Button, Table, Tag, theme, Input, Select, Space, Dropdown, message, Modal } from 'antd';
import {
    PlusOutlined,
    FileTextOutlined,
    SearchOutlined,
    MailOutlined,
    DownloadOutlined,
    CloseCircleOutlined,
    MoreOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import OnboardingStepper from '../components/onboarding/OnboardingStepper';
import OnboardingDocuments from '../components/onboarding/OnboardingDocuments';
import OfferDrawer from '../components/onboarding/OfferDrawer';
import MentorshipProgram from '../components/onboarding/MentorshipProgram';
import HRNotes from '../components/onboarding/HRNotes';

import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;
const { confirm } = Modal;

const Onboarding = () => {
    const { token } = theme.useToken();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [offersData, setOffersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [editingOffer, setEditingOffer] = useState(null);

    // Derived state for the detail panels
    const selectedOffer = offersData.find(o => o.id === selectedOfferId) || (offersData.length > 0 ? offersData[0] : null);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/offers`, {
                params: {
                    status: statusFilter,
                    search: searchText
                }
            });
            if (response.data.success) {
                // Map backend data to table data
                const formattedData = response.data.data.map(offer => ({
                    key: offer._id,
                    id: offer._id,
                    name: offer.candidateId?.name || 'Unknown',
                    email: offer.candidateId?.email || '',
                    phone: offer.candidateId?.phone || '',
                    role: offer.role,
                    status: offer.status === 'OFFER_ACCEPTED' ? 'Accepted' :
                        offer.status === 'Sent' ? 'Sent' :
                            offer.status === 'Draft' ? 'Draft' :
                                offer.status === 'DECLINED' ? 'Rejected' : offer.status,
                    rawStatus: offer.status,
                    date: new Date(offer.createdAt).toLocaleDateString(),
                    joiningDate: offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'N/A',
                    department: offer.department,
                    salary: offer.salary
                }));
                setOffersData(formattedData);

                // Auto-select first offer if none selected or previous selection gone
                if (formattedData.length > 0 && (!selectedOfferId || !formattedData.find(o => o.id === selectedOfferId))) {
                    setSelectedOfferId(formattedData[0].id);
                }
            }
        } catch (error) {
            message.error('Failed to fetch offers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchText]); // Removed selectedOfferId from dependency to avoid loop on auto-select

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleOfferAction = async (action, record) => {
        switch (action) {
            case 'edit':
                if (record.rawStatus === 'OFFER_ACCEPTED') {
                    message.error('Cannot edit an accepted offer');
                    return;
                }
                setEditingOffer(record);
                setIsDrawerOpen(true);
                break;
            case 'delete':
                if (record.rawStatus === 'OFFER_ACCEPTED') {
                    message.error('Cannot delete an accepted offer');
                    return;
                }
                confirm({
                    title: 'Are you sure you want to delete this offer?',
                    icon: <ExclamationCircleOutlined />,
                    content: `This will remove the offer for ${record.name} permanently.`,
                    okText: 'Yes, Delete',
                    okType: 'danger',
                    cancelText: 'No',
                    async onOk() {
                        try {
                            await axios.delete(`http://localhost:5000/api/offers/${record.id}`);
                            message.success('Offer deleted successfully');
                            fetchOffers();
                        } catch (error) {
                            message.error(error.response?.data?.error || 'Failed to delete offer');
                        }
                    }
                });
                break;
            case 'resend':
                message.success(`Offer resent to ${record.name}`);
                break;
            case 'download':
                message.success(`Downloading offer letter for ${record.name}`);
                break;
            case 'view':
                setSelectedOfferId(record.id);
                break;
            default:
                break;
        }
    };

    const getActionMenu = (record) => ({
        items: [
            {
                key: 'edit',
                label: 'Edit Offer',
                icon: <EditOutlined />,
                disabled: record.rawStatus === 'OFFER_ACCEPTED',
                onClick: () => handleOfferAction('edit', record)
            },
            {
                key: 'resend',
                label: 'Resend Offer',
                icon: <MailOutlined />,
                disabled: record.rawStatus === 'Draft' || record.rawStatus === 'OFFER_ACCEPTED',
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
                key: 'delete',
                label: 'Delete Offer',
                icon: <CloseCircleOutlined />,
                danger: true,
                disabled: record.rawStatus === 'OFFER_ACCEPTED',
                onClick: () => handleOfferAction('delete', record)
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
                if (status === 'Rejected') { color = 'error'; bg = `${token.colorError}15`; }
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
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleOfferAction('view', record);
                        }}
                    >
                        View Offer
                    </Button>
                    <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            size="small"
                            onClick={(e) => e.stopPropagation()} // Prevent row click
                        />
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOffer(null); setIsDrawerOpen(true); }} size="large">
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
                                    placeholder="Search by candidate name or email"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 280 }}
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
                                    <Select.Option value="OFFER_ACCEPTED">Accepted</Select.Option>
                                    <Select.Option value="DECLINED">Rejected</Select.Option>
                                </Select>
                            </Space>

                            <style>
                                {`
                                    .selected-row {
                                        background-color: ${token.colorPrimary}15 !important;
                                    }
                                    .glass-table .ant-table-row {
                                        cursor: pointer;
                                    }
                                `}
                            </style>
                            <Table
                                dataSource={offersData}
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                                className="glass-table"
                                loading={loading}
                                onRow={(record) => ({
                                    onClick: () => setSelectedOfferId(record.id),
                                })}
                                rowClassName={(record) => record.id === selectedOfferId ? 'selected-row' : ''}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <OnboardingDocuments employeeId={selectedOffer?.id} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <HRNotes />
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <OnboardingStepper candidateData={selectedOffer} fetchStatus={true} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <MentorshipProgram />
                        </motion.div>
                    </Col>
                </Row>

                <OfferDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSuccess={() => { setIsDrawerOpen(false); fetchOffers(); }}
                    editData={editingOffer}
                />
            </motion.div>
        </PageContainer>
    );
};

export default Onboarding;
