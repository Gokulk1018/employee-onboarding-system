import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Button, Table, Tag, theme, Input, Select, Space, Dropdown, message, Modal, Tabs } from 'antd';
import {
    PlusOutlined,
    FileTextOutlined,
    SearchOutlined,
    MailOutlined,
    DownloadOutlined,
    CloseCircleOutlined,
    MoreOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    KeyOutlined,
    CheckCircleOutlined
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
    const [activeTab, setActiveTab] = useState('offers');
    const [reviewData, setReviewData] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Derived state for the detail panels
    const selectedOffer = offersData.find(o => o.id === selectedOfferId) || null;

    const fetchReviews = async () => {
        setReviewLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/onboarding/users');
            if (response.data.success) {
                setReviewData(response.data.data.filter(u => u.status !== 'pending'));
            }
        } catch (error) {
            message.error('Failed to fetch reviews');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleReviewAction = async (id, action) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/onboarding/${action}/${id}`);
            if (response.data.success) {
                message.success(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully`);
                fetchReviews();
                fetchOffers();
            }
        } catch (error) {
            message.error('Action failed');
        }
    };

    const OnboardingReviewList = () => {
        const reviewColumns = [
            { title: 'Candidate', dataIndex: 'candidateName', key: 'name' },
            { title: 'Email', dataIndex: 'candidateEmail', key: 'email' },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: status => (
                    <Tag color={status === 'submitted' ? 'blue' : (status === 'approved' ? 'success' : 'error')}>
                        {status.toUpperCase()}
                    </Tag>
                )
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                    <Space>
                        <Button type="link" onClick={() => { setSelectedReview(record); setIsReviewModalOpen(true); }}>View Details</Button>
                        {record.status === 'submitted' && (
                            <>
                                <Button type="primary" size="small" onClick={() => handleReviewAction(record._id, 'approve')}>Approve</Button>
                                <Button danger size="small" onClick={() => handleReviewAction(record._id, 'reject')}>Reject</Button>
                            </>
                        )}
                    </Space>
                )
            }
        ];

        return (
            <>
                <Table
                    dataSource={reviewData}
                    columns={reviewColumns}
                    loading={reviewLoading}
                    rowKey="_id"
                />
                <Modal
                    title="Candidate Details"
                    open={isReviewModalOpen}
                    onCancel={() => setIsReviewModalOpen(false)}
                    footer={null}
                    width={800}
                >
                    {selectedReview && (
                        <div style={{ padding: '20px 0' }}>
                            <Title level={4}>Personal Information</Title>
                            <Row gutter={[16, 16]}>
                                {Object.entries(selectedReview.onboardingData || {}).map(([key, val]) => (
                                    <Col span={12} key={key}>
                                        <Text type="secondary">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</Text>
                                        <div>{val}</div>
                                    </Col>
                                ))}
                            </Row>
                            <Title level={4} style={{ marginTop: 24 }}>Documents</Title>
                            <Row gutter={[16, 16]}>
                                {(selectedReview.documents || []).map((doc, idx) => (
                                    <Col span={8} key={idx}>
                                        <Card size="small" hoverable>
                                            <Space direction="vertical">
                                                <FileTextOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
                                                <Text ellipsis>{doc.name}</Text>
                                                <Button type="link" href={doc.url} target="_blank" size="small">Download</Button>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Modal>
            </>
        );
    };

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
                    name: offer.candidateName || "N/A",
                    email: offer.candidateEmail || '',
                    phone: offer.candidatePhone || '',
                    role: offer.role,
                    status: offer.status,
                    rawStatus: offer.status,
                    date: new Date(offer.createdAt).toLocaleDateString(),
                    joiningDate: offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'N/A',
                    rawJoiningDate: offer.joiningDate,
                    department: offer.department,
                    salary: offer.salary
                }));
                console.log('[DEBUG] Fetched Offers:', formattedData);
                setOffersData(formattedData);

                // Auto-select first offer if none selected or previous selection gone
                if (formattedData.length > 0 && (!selectedOfferId || !formattedData.find(o => o.id === selectedOfferId))) {
                    setSelectedOfferId(formattedData[0].id);
                }
            }
        } catch (error) {
            console.warn('Backend not available, using mock data:', error.message);

            // Fallback to mock data when backend is not available
            const mockOffers = [
                {
                    key: 'mock-1',
                    id: 'mock-1',
                    name: 'Sarah Johnson',
                    email: 'sarah.johnson@example.com',
                    phone: '+1 (555) 123-4567',
                    role: 'Senior Software Engineer',
                    status: 'Sent',
                    rawStatus: 'Sent',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    rawJoiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    department: 'Engineering',
                    salary: '$120,000 - $150,000'
                },
                {
                    key: 'mock-2',
                    id: 'mock-2',
                    name: 'Michael Chen',
                    email: 'michael.chen@example.com',
                    phone: '+1 (555) 234-5678',
                    role: 'Product Manager',
                    status: 'Accepted',
                    rawStatus: 'Accepted',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    joiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    rawJoiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    department: 'Product',
                    salary: '$110,000 - $140,000'
                },
                {
                    key: 'mock-3',
                    id: 'mock-3',
                    name: 'Emily Rodriguez',
                    email: 'emily.rodriguez@example.com',
                    phone: '+1 (555) 345-6789',
                    role: 'UX Designer',
                    status: 'Draft',
                    rawStatus: 'Draft',
                    date: new Date().toLocaleDateString(),
                    joiningDate: 'N/A',
                    rawJoiningDate: null,
                    department: 'Design',
                    salary: '$90,000 - $115,000'
                },
                {
                    key: 'mock-4',
                    id: 'mock-4',
                    name: 'David Kim',
                    email: 'david.kim@example.com',
                    phone: '+1 (555) 456-7890',
                    role: 'DevOps Engineer',
                    status: 'Rejected',
                    rawStatus: 'Rejected',
                    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    joiningDate: 'N/A',
                    rawJoiningDate: null,
                    department: 'Engineering',
                    salary: '$105,000 - $130,000'
                }
            ];

            // Apply filters to mock data
            let filteredMockOffers = mockOffers;

            if (statusFilter !== 'All') {
                filteredMockOffers = mockOffers.filter(offer => offer.rawStatus === statusFilter);
            }

            if (searchText) {
                const searchLower = searchText.toLowerCase();
                filteredMockOffers = filteredMockOffers.filter(offer =>
                    offer.name.toLowerCase().includes(searchLower) ||
                    offer.email.toLowerCase().includes(searchLower) ||
                    offer.role.toLowerCase().includes(searchLower)
                );
            }

            setOffersData(filteredMockOffers);

            // Auto-select first offer
            if (filteredMockOffers.length > 0 && (!selectedOfferId || !filteredMockOffers.find(o => o.id === selectedOfferId))) {
                setSelectedOfferId(filteredMockOffers[0].id);
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchText, selectedOfferId]); // Added selectedOfferId back for mock data filtering

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleOfferAction = async (action, record) => {
        switch (action) {
            case 'edit':
                setEditingOffer(record);
                setIsDrawerOpen(true);
                break;
            case 'delete':
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
                const resendHide = message.loading(`Resending offer to ${record.name}...`, 0);
                try {
                    await axios.post(`http://localhost:5000/api/offers/resend/${record.id}`);
                    message.success(`Offer resent successfully to ${record.name}`);
                    fetchOffers(); // Refresh to show updated status
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to resend offer email');
                } finally {
                    resendHide();
                }
                break;
            case 'generateCredentials':
                const genHide = message.loading(`Generating credentials for ${record.name}...`, 0);
                try {
                    await axios.post(`http://localhost:5000/api/employees/generate-credentials/${record.id}`);
                    message.success(`Credentials sent to ${record.name}`);
                    fetchOffers();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to generate credentials');
                } finally {
                    genHide();
                }
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
                onClick: () => handleOfferAction('edit', record)
            },
            {
                key: 'resend',
                label: 'Resend Offer',
                icon: <MailOutlined />,
                disabled: record.rawStatus === 'Draft' || record.rawStatus === 'Accepted' || record.rawStatus === 'OFFER_ACCEPTED',
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
                onClick: () => handleOfferAction('delete', record)
            },
            {
                type: 'divider'
            },
            {
                key: 'credentials',
                label: 'Send Login Credentials',
                icon: <KeyOutlined />,
                disabled: record.rawStatus !== 'Accepted' && record.rawStatus !== 'OFFER_ACCEPTED',
                onClick: () => handleOfferAction('generateCredentials', record)
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
                    <Col xs={24}>
                        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                            <Tabs
                                defaultActiveKey="offers"
                                onChange={(key) => {
                                    setActiveTab(key);
                                    if (key === 'review') fetchReviews();
                                }}
                                items={[
                                    {
                                        key: 'offers',
                                        label: <span style={{ fontSize: 16 }}><FileTextOutlined /> Recruitment Offers</span>,
                                        children: (
                                            <>
                                                <div className="flex-between" style={{ marginBottom: 16 }}>
                                                    <Space size="middle">
                                                        <Input
                                                            placeholder="Search candidates"
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
                                                </div>
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
                                            </>
                                        )
                                    },
                                    {
                                        key: 'review',
                                        label: <span style={{ fontSize: 16 }}><CheckCircleOutlined /> Onboarding Reviews</span>,
                                        children: <OnboardingReviewList />
                                    }
                                ]} />
                        </div>
                    </Col>
                </Row>

                {activeTab === 'offers' && (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
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
                )}

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
