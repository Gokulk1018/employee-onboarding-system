import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Row, Col, Button, Table, Tag, theme, Input, Select, Space, Dropdown, Modal, Card, Spin, Badge, App, Divider, DatePicker, List } from 'antd';
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
    CheckCircleOutlined,
    DeleteOutlined,
    FilterOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    UserOutlined,
    EyeOutlined,
    SendOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import axios from 'axios';
import OnboardingStepper from '../components/onboarding/OnboardingStepper';
import OfferDrawer from '../components/onboarding/OfferDrawer';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';

import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title, Text } = Typography;
const { confirm } = Modal;

const OnboardingReviewList = ({
    reviewData,
    reviewLoading,
    reviewSearchText,
    setReviewSearchText,
    selectedReview,
    setSelectedReviewId,
    isReviewModalOpen,
    setIsReviewModalOpen,
    fetchReviews,
    fetchOffers,
    setSelectedOfferId,
    offersData
}) => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [reviewRemarks, setReviewRemarks] = useState('');
    const [joiningDate, setJoiningDate] = useState(null);
    const [verificationLoading, setVerificationLoading] = useState(false);

    const filteredReviewData = reviewData.filter(record =>
        record.candidateName.toLowerCase().includes(reviewSearchText.toLowerCase()) ||
        record.candidateEmail.toLowerCase().includes(reviewSearchText.toLowerCase())
    );

    const reviewColumns = [
        { title: 'Candidate', dataIndex: 'candidateName', key: 'name' },
        { title: 'Email', dataIndex: 'candidateEmail', key: 'email' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: status => (
                <Tag color={status === 'submitted' ? 'blue' : (status === 'approved' ? 'success' : 'error')}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelectedReviewId(record._id); setIsReviewModalOpen(true); }} style={{ padding: 0 }}>Review Details</Button>
                    {record.status === 'reupload_required' && (
                        <Tag color="warning" style={{ margin: 0, fontSize: 10 }}>WAITING FOR RE-UPLOAD</Tag>
                    )}
                </div>
            )
        }
    ];

    const handleVerifyDoc = async (docId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/onboarding/verify-document/${selectedReview._id}`, {
                documentId: docId,
                status
            });
            message.success('Document status updated');
            fetchReviews();
        } catch (error) {
            message.error('Failed to update document status');
        }
    };

    const handleFinalAction = async (action) => {
        if (action === 'finalize' && !joiningDate) {
            return message.warning('Please select a joining date first');
        }

        setVerificationLoading(true);
        try {
            const endpoint = action === 'finalize' ? 'finalize' : 'reject-details';
            const payload = action === 'finalize' ? { joiningDate } : { remarks: reviewRemarks };
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/onboarding/${endpoint}/${selectedReview._id}`, payload);
            if (response.data.success) {
                message.success(action === 'finalize' ? 'Onboarding finalized successfully' : 'Onboarding details rejected');
                setIsReviewModalOpen(false);
                fetchReviews();
                fetchOffers();
            }
        } catch (error) {
            message.error('Action failed: ' + (error.response?.data?.message || 'Server error'));
        } finally {
            setVerificationLoading(false);
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search onboarding candidates"
                    prefix={<SearchOutlined />}
                    value={reviewSearchText}
                    onChange={(e) => setReviewSearchText(e.target.value)}
                    style={{ width: 280 }}
                    allowClear
                />
            </div>
            <Table
                dataSource={filteredReviewData}
                columns={reviewColumns}
                loading={reviewLoading}
                rowKey="_id"
                className="glass-table"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
                onRow={(record) => ({
                    onClick: () => {
                        const matchingOffer = offersData.find(o => o.email === record.candidateEmail);
                        if (matchingOffer) {
                            setSelectedOfferId(matchingOffer.id);
                        }
                    }
                })}
                rowClassName={(record) => record._id === selectedReview?._id ? 'selected-row' : ''}
            />
            <Modal
                title={
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Title level={3} style={{ margin: 0 }}>Onboarding Review: {selectedReview?.candidateName}</Title>
                        <Tag color={selectedReview?.status === 'submitted' ? 'blue' : (selectedReview?.status === 'approved' ? 'success' : 'error')}>
                            {selectedReview?.status?.toUpperCase()}
                        </Tag>
                    </Space>
                }
                open={isReviewModalOpen}
                onCancel={() => setIsReviewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsReviewModalOpen(false)}>Close</Button>,
                    selectedReview?.status !== 'approved' && (
                        <Button key="reject" danger onClick={() => handleFinalAction('reject-details')} loading={verificationLoading} icon={<CloseCircleOutlined />}>
                            Reject Details
                        </Button>
                    ),
                    selectedReview?.status !== 'approved' && (
                        <Button key="accept" type="primary" onClick={() => handleFinalAction('finalize')} loading={verificationLoading} icon={<CheckCircleOutlined />}>
                            Accept Details & Finalize
                        </Button>
                    )
                ]}
                width={1000}
                className="glass-modal"
                centered
            >
                {selectedReview && (
                    <div style={{ padding: '20px 0' }}>
                        <Row gutter={24}>
                            <Col span={15}>
                                <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <UserOutlined /> Personal Information
                                </Title>
                                <Card variant="borderless" className="glass-card" style={{ marginBottom: 24, background: `${token.colorPrimary}05` }}>
                                    <Row gutter={[16, 24]}>
                                        <Col span={12}>
                                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Full Name</Text>
                                            <div style={{ fontWeight: 600, color: token.colorText, fontSize: 15 }}>{selectedReview.onboardingData?.fullName || selectedReview.candidateName}</div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Email Address</Text>
                                            <div style={{ fontWeight: 600, color: token.colorText, fontSize: 15 }}>{selectedReview.onboardingData?.email || selectedReview.candidateEmail}</div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Phone Number</Text>
                                            <div style={{ fontWeight: 600, color: token.colorText, fontSize: 15 }}>{selectedReview.candidatePhone || selectedReview.onboardingData?.phone || 'N/A'}</div>
                                        </Col>
                                        <Col span={24}>
                                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Address</Text>
                                            <div style={{ fontWeight: 600, color: token.colorText, fontSize: 15 }}>{selectedReview.candidateAddress || selectedReview.onboardingData?.address || 'N/A'}</div>
                                        </Col>
                                        {Object.entries(selectedReview.onboardingData || {}).map(([key, val]) => {
                                            if (['fullName', 'email', 'phone', 'address'].includes(key)) return null;
                                            return (
                                                <Col span={12} key={key}>
                                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1')}</Text>
                                                    <div style={{ fontWeight: 600, color: token.colorText, fontSize: 15 }}>{val || 'N/A'}</div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Card>

                                <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FileTextOutlined /> Uploaded Documents
                                </Title>
                                <List
                                    dataSource={selectedReview.documents || []}
                                    renderItem={(doc) => (
                                        <List.Item
                                            actions={[
                                                <Button type="link" href={doc.url} target="_blank" icon={<EyeOutlined />}>View</Button>,
                                                <Space>
                                                    <Button
                                                        size="small"
                                                        type={doc.status === 'verified' ? 'primary' : 'default'}
                                                        icon={<CheckCircleOutlined />}
                                                        onClick={() => handleVerifyDoc(doc._id, 'verified')}
                                                    >
                                                        {doc.status === 'verified' ? 'Verified' : 'Verify'}
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        danger={doc.status === 'rejected'}
                                                        icon={<CloseCircleOutlined />}
                                                        onClick={() => handleVerifyDoc(doc._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Space>
                                            ]}
                                            className="glass-card"
                                            style={{ marginBottom: 12, padding: '12px 20px', borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}` }}
                                        >
                                            <List.Item.Meta
                                                avatar={<div style={{ padding: 8, background: `${token.colorPrimary}15`, borderRadius: 8 }}><FileTextOutlined style={{ fontSize: 24, color: token.colorPrimary }} /></div>}
                                                title={<Text strong>{doc.name}</Text>}
                                                description={
                                                    <Space split={<Divider type="vertical" />}>
                                                        <Tag bordered={false} color={doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'error' : 'processing'}>
                                                            {doc.status?.toUpperCase() || 'PENDING'}
                                                        </Tag>
                                                        <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Col>

                            <Col span={9}>
                                <div style={{ position: 'sticky', top: 0 }}>
                                    <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <ClockCircleOutlined /> Finalization
                                    </Title>
                                    <Card className="glass-card" style={{ background: `${token.colorSuccess}05`, border: `1px dashed ${token.colorSuccess}50` }}>
                                        <div style={{ marginBottom: 20 }}>
                                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Joining Date</label>
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                size="large"
                                                placeholder="Select joining date"
                                                onChange={(date) => setJoiningDate(date ? date.toISOString() : null)}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>HR Remarks / Notes</label>
                                            <Input.TextArea
                                                rows={5}
                                                placeholder="Add feedback for the candidate or internal notes..."
                                                value={reviewRemarks}
                                                onChange={(e) => setReviewRemarks(e.target.value)}
                                                className="glass-input"
                                            />
                                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
                                                * Remarks will be shared with the candidate if details are rejected.
                                            </Text>
                                        </div>
                                    </Card>

                                    <div style={{ marginTop: 24, padding: 16, background: `${token.colorInfo}10`, borderRadius: 12 }}>
                                        <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 14 }}>Review Summary</Title>
                                        <ul style={{ paddingLeft: 20, margin: 0, color: token.colorTextSecondary, fontSize: 13 }}>
                                            <li>Verify all mandatory documents</li>
                                            <li>Cross-check personal information</li>
                                            <li>Set an accurate joining date</li>
                                            <li>Provide clear remarks for rejection</li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </>
    );
};

const Onboarding = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const location = useLocation(); // Hook for navigation state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    // Initialize reviewSearchText from navigation state if present
    const [reviewSearchText, setReviewSearchText] = useState(location.state?.searchCandidate || '');
    const [offersData, setOffersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [editingOffer, setEditingOffer] = useState(null);
    const [reviewData, setReviewData] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isManualEntryModalOpen, setIsManualEntryModalOpen] = useState(false);
    const [manualEntryData, setManualEntryData] = useState(null);

    // Derived state for the detail panels
    const selectedOffer = offersData.find(o => o.id === selectedOfferId) || null;
    const selectedReview = reviewData.find(r => r._id === selectedReviewId) || null;

    const fetchReviews = useCallback(async () => {
        // Only show full loading spinner on initial fetch, not during polling
        if (reviewData.length === 0) setReviewLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/onboarding/users`);
            if (response.data.success) {
                setReviewData(response.data.data.filter(u => u.status !== 'pending'));
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setReviewLoading(false);
        }
    }, [reviewData.length]);

    // Auto-refresh reviews every 10 seconds
    useEffect(() => {
        fetchReviews();
        const interval = setInterval(fetchReviews, 10000);
        return () => clearInterval(interval);
    }, [fetchReviews]);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers`, {
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
                    salary: offer.salary,
                    onboardingStep: offer.onboardingStep
                }));
                console.log('[DEBUG] Fetched Offers:', formattedData);
                setOffersData(formattedData);

                // Auto-select first offer if none selected or previous selection gone
                if (formattedData.length > 0) {
                    setSelectedOfferId(prev => {
                        if (!prev || !formattedData.find(o => o.id === prev)) {
                            return formattedData[0].id;
                        }
                        return prev;
                    });
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
            if (filteredMockOffers.length > 0) {
                setSelectedOfferId(prev => {
                    if (!prev || !filteredMockOffers.find(o => o.id === prev)) {
                        return filteredMockOffers[0].id;
                    }
                    return prev;
                });
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchText]); // Removed selectedOfferId to prevent infinite loop

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
                            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/${record.id}`);
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
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/resend/${record.id}`);
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
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/employees/generate-credentials/${record.id}`);
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

    const handleAdvanceStage = async () => {
        if (!selectedOfferId) return;

        const offer = offersData.find(o => o.id === selectedOfferId);
        if (!offer) return;

        // If at Ready stage, handle conversion to employee
        if (offer.onboardingStep === 'Ready') {
            try {
                message.loading({ content: 'Adding as new employee...', key: 'convertEmployee' });
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/${selectedOfferId}/convert`);

                if (response.data.success) {
                    message.success({ content: 'Employee created successfully!', key: 'convertEmployee' });
                    setSelectedOfferId(null); // Clear selection as the offer is gone
                    fetchOffers(); // Refresh lists
                    fetchReviews();
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to add employee';
                message.error({ content: errorMsg, key: 'convertEmployee' });

                // If it's a duplicate email error, show manual entry modal
                if (errorMsg.includes('already exists')) {
                    setManualEntryData({
                        name: offer.name,
                        email: offer.email,
                        department: offer.department,
                        role: offer.role,
                        joinDate: offer.rawJoiningDate,
                        status: 'Active'
                    });
                    setIsManualEntryModalOpen(true);
                }
            }
            return;
        }

        if (offer.id.toString().startsWith('mock-')) {
            message.info('Cannot advance mock candidates. Please create a real offer.');
            return;
        }

        try {
            message.loading({ content: 'Moving to next stage...', key: 'advanceStage' });
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/${selectedOfferId}/advance`);

            if (response.data.success) {
                message.success({ content: `Moved to ${response.data.data.onboardingStep}`, key: 'advanceStage' });
                fetchOffers(); // Refresh data
            }
        } catch (error) {
            message.error({ content: error.response?.data?.message || 'Failed to advance stage', key: 'advanceStage' });
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

    const handleManualEntrySuccess = async () => {
        try {
            // After manual employee creation, we must delete the offer to complete the "conversion"
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/${selectedOfferId}`);
            setSelectedOfferId(null);
            fetchOffers();
            fetchReviews();
        } catch (error) {
            console.error('Failed to cleanup offer after manual entry', error);
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
                            Manage recruitment offers and monitor onboarding progress in real-time.
                        </div>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOffer(null); setIsDrawerOpen(true); }} size="large">
                        Create Offer
                    </Button>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Top Section: Recruitment Offers */}
                    <Col span={24}>
                        <Card variant="borderless" className="glass-card" style={{ marginBottom: 24 }}>
                            <div className="flex-between" style={{ marginBottom: 20 }}>
                                <Title level={4} style={{ margin: 0 }}><FileTextOutlined /> Recruitment Offers</Title>
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
                                scroll={{ x: true }}
                            />
                        </Card>
                    </Col>

                    {/* Left Column: Onboarding Reviews */}
                    <Col xs={24} xl={16}>
                        <Card variant="borderless" className="glass-card" style={{ height: '100%' }}>
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} style={{ margin: 0 }}><CheckCircleOutlined /> Onboarding Reviews</Title>
                                <Text type="secondary">Review and verify documents submitted by candidates</Text>
                            </div>
                            <OnboardingReviewList
                                reviewData={reviewData}
                                reviewLoading={reviewLoading}
                                reviewSearchText={reviewSearchText}
                                setReviewSearchText={setReviewSearchText}
                                selectedReview={selectedReview}
                                setSelectedReviewId={setSelectedReviewId}
                                isReviewModalOpen={isReviewModalOpen}
                                setIsReviewModalOpen={setIsReviewModalOpen}
                                fetchReviews={fetchReviews}
                                fetchOffers={fetchOffers}
                                setSelectedOfferId={setSelectedOfferId}
                                offersData={offersData}
                            />
                        </Card>
                    </Col>

                    {/* Right Column: Progress */}
                    <Col xs={24} xl={8}>
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            <motion.div variants={itemVariants}>
                                <OnboardingStepper candidateData={selectedOffer} fetchStatus={true} />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={selectedOffer?.onboardingStep === 'Ready' ? <UserAddOutlined /> : <CheckCircleOutlined />}
                                    style={{
                                        height: 50,
                                        borderRadius: 12,
                                        fontWeight: 600,
                                        boxShadow: `0 4px 14px ${selectedOffer?.onboardingStep === 'Ready' ? '#10b981' : token.colorPrimary}40`,
                                        background: selectedOffer?.onboardingStep === 'Ready' ? '#10b981' : undefined,
                                        borderColor: selectedOffer?.onboardingStep === 'Ready' ? '#10b981' : undefined
                                    }}
                                    onClick={handleAdvanceStage}
                                    disabled={!selectedOffer}
                                >
                                    {selectedOffer?.onboardingStep === 'Ready' ? 'Add as New Employee' : 'Move to Next Stage'}
                                </Button>
                            </motion.div>
                        </Space>
                    </Col>
                </Row>

                <OfferDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    destroyOnHidden={true}
                    editData={editingOffer}
                />
            </motion.div>

            <AddEmployeeModal
                open={isManualEntryModalOpen}
                onClose={() => {
                    setIsManualEntryModalOpen(false);
                    setManualEntryData(null);
                }}
                onSuccess={handleManualEntrySuccess}
                initialData={manualEntryData}
            />
        </PageContainer>
    );
};

export default Onboarding;
