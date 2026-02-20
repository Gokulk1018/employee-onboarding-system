import React, { useState } from 'react';
import { List, Avatar, Typography, theme, Button, Tag, Modal, message, Skeleton, Empty } from 'antd';
import { FileSearchOutlined, MailOutlined, CarryOutOutlined, ArrowRightOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const PendingApprovals = ({ data, loading, onRefresh }) => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [pendingOffers, setPendingOffers] = useState([]);
    const [pendingDocs, setPendingDocs] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPendingOffers = async () => {
        setModalLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/pending-offers');
            if (response.data.success) {
                setPendingOffers(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch pending offers');
        } finally {
            setModalLoading(false);
        }
    };

    const fetchPendingDocs = async () => {
        setModalLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/pending-documents');
            if (response.data.success) {
                setPendingDocs(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch pending documents');
        } finally {
            setModalLoading(false);
        }
    };

    const handleSendCredentials = async (offerId) => {
        setActionLoading(offerId);
        try {
            const response = await axios.post(`http://localhost:5000/api/dashboard/send-credentials/${offerId}`);
            if (response.data.success) {
                message.success('Credentials sent successfully');
                // Remove from list
                setPendingOffers(prev => prev.filter(o => o._id !== offerId));
                // Trigger dashboard refresh if available
                if (onRefresh) onRefresh();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send credentials');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCardClick = (type) => {
        if (type === 'Offer Letters') {
            setIsOfferModalOpen(true);
            fetchPendingOffers();
        } else if (type === 'Document Verification') {
            setIsDocModalOpen(true);
            fetchPendingDocs();
        }
    };

    const handleNavigateToDocs = (email) => {
        navigate('/onboarding', { state: { searchCandidate: email } });
    };

    const items = [
        {
            title: 'Leave Requests',
            count: data?.leaveRequests || 0,
            icon: <CarryOutOutlined />,
            color: '#f59e0b',
            onClick: () => message.info('Leave requests module coming soon')
        },
        {
            title: 'Offer Letters',
            count: data?.offerLetters || 0,
            icon: <MailOutlined />,
            color: '#7c3aed',
            onClick: () => handleCardClick('Offer Letters')
        },
        {
            title: 'Document Verification',
            count: data?.documentVerification || 0,
            icon: <FileSearchOutlined />,
            color: '#3b82f6',
            onClick: () => handleCardClick('Document Verification')
        }
    ];

    return (
        <>
            <div className="glass-card" style={{ height: '100%', padding: 24, borderColor: token.colorBorder }}>
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ margin: 0, color: token.colorText }}>Pending Approvals</Title>
                    <Button type="text" style={{ color: token.colorPrimary }}>View All <ArrowRightOutlined /></Button>
                </div>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={(item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <List.Item
                                style={{
                                    padding: '16px 0',
                                    borderBlockEnd: index === items.length - 1 ? 'none' : `1px solid ${token.colorBorder}`,
                                    cursor: 'pointer'
                                }}
                                onClick={item.onClick}
                                className="hover-bg-list"
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            icon={item.icon}
                                            style={{
                                                backgroundColor: `${item.color}15`,
                                                color: item.color,
                                                border: `1px solid ${item.color}30`
                                            }}
                                            size="large"
                                        />
                                    }
                                    title={<Text strong style={{ color: token.colorText }}>{item.title}</Text>}
                                    description={
                                        <div className="flex-between">
                                            <Text style={{ color: token.colorTextSecondary }}>Requires your review</Text>
                                            <Tag color={item.count > 0 ? 'warning' : 'default'} style={{ borderRadius: 12 }}>
                                                {item.count} Pending
                                            </Tag>
                                        </div>
                                    }
                                />
                            </List.Item>
                        </motion.div>
                    )}
                />
            </div>

            {/* Offer Letters Modal */}
            <Modal
                title="Pending Offer Utilites"
                open={isOfferModalOpen}
                onCancel={() => setIsOfferModalOpen(false)}
                footer={null}
                className="glass-modal"
            >
                <List
                    loading={modalLoading}
                    dataSource={pendingOffers}
                    locale={{ emptyText: <Empty description="No pending offers to send credentials" /> }}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<SendOutlined />}
                                    loading={actionLoading === item._id}
                                    onClick={() => handleSendCredentials(item._id)}
                                >
                                    Send Credentials
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: token.colorPrimary }}>{item.candidateName[0]}</Avatar>}
                                title={item.candidateName}
                                description={
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{item.candidateEmail}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{item.role}</Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            {/* Document Verification Modal */}
            <Modal
                title="Pending Document Verification"
                open={isDocModalOpen}
                onCancel={() => setIsDocModalOpen(false)}
                footer={null}
                className="glass-modal"
            >
                <List
                    loading={modalLoading}
                    dataSource={pendingDocs}
                    locale={{ emptyText: <Empty description="No pending documents to verify" /> }}
                    renderItem={item => (
                        <List.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToDocs(item.email)}
                            className="hover-bg-list"
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={item.name}
                                description={
                                    <div className="flex-between">
                                        <Text type="secondary">{item.email}</Text>
                                        <Tag color="processing">{item.pendingCount} Pending Docs</Tag>
                                    </div>
                                }
                            />
                            <ArrowRightOutlined style={{ color: token.colorTextSecondary }} />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default PendingApprovals;
