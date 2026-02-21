import React, { useState } from 'react';
import { List, Avatar, Typography, theme, Button, Tag, Modal, message, Skeleton, Empty, Space, Popconfirm } from 'antd';
import { FileSearchOutlined, MailOutlined, CarryOutOutlined, ArrowRightOutlined, SendOutlined, UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { updateLeaveStatus } from '../../services/leaveService';

const { Text, Title } = Typography;

const PendingApprovals = ({ data, loading, onRefresh }) => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [pendingOffers, setPendingOffers] = useState([]);
    const [pendingDocs, setPendingDocs] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPendingOffers = async () => {
        setModalLoading(true);
        try {
            const response = await api.get('/dashboard/pending-offers');
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
            const response = await api.get('/dashboard/pending-documents');
            if (response.data.success) {
                setPendingDocs(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch pending documents');
        } finally {
            setModalLoading(false);
        }
    };

    const fetchPendingLeaves = async () => {
        setModalLoading(true);
        try {
            const response = await api.get('/dashboard/pending-leaves');
            if (response.data.success) {
                setPendingLeaves(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch pending leave requests');
        } finally {
            setModalLoading(false);
        }
    };

    const handleSendCredentials = async (offerId) => {
        setActionLoading(offerId);
        try {
            const response = await api.post(`/dashboard/send-credentials/${offerId}`);
            if (response.data.success) {
                message.success('Credentials sent successfully');
                setPendingOffers(prev => prev.filter(o => o._id !== offerId));
                if (onRefresh) onRefresh();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send credentials');
        } finally {
            setActionLoading(null);
        }
    };

    const handleLeaveAction = async (id, status) => {
        setActionLoading(id);
        try {
            await updateLeaveStatus(id, status);
            message.success(`Leave request ${status.toLowerCase()} successfully`);
            setPendingLeaves(prev => prev.filter(l => l._id !== id));
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error('Failed to update leave status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCardClick = (type) => {
        if (type === 'Offer Letters') {
            setIsOfferModalOpen(true);
            fetchPendingOffers();
        } else if (type === 'Document Verification') {
            navigate('/onboarding');
        } else if (type === 'Leave Requests') {
            setIsLeaveModalOpen(true);
            fetchPendingLeaves();
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
            onClick: () => handleCardClick('Leave Requests')
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

            {/* Leave Requests Modal */}
            <Modal
                title="Pending Leave Requests"
                open={isLeaveModalOpen}
                onCancel={() => setIsLeaveModalOpen(false)}
                footer={null}
                className="glass-modal"
                width={600}
            >
                <List
                    loading={modalLoading}
                    dataSource={pendingLeaves}
                    locale={{ emptyText: <Empty description="No pending leave requests" /> }}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Space key="actions">
                                    <Popconfirm title="Approve leave?" onConfirm={() => handleLeaveAction(item._id, 'Approved')}>
                                        <Button type="primary" size="small" icon={<CheckOutlined />} loading={actionLoading === item._id}>Approve</Button>
                                    </Popconfirm>
                                    <Popconfirm title="Reject leave?" onConfirm={() => handleLeaveAction(item._id, 'Rejected')}>
                                        <Button danger size="small" icon={<CloseOutlined />} loading={actionLoading === item._id}>Reject</Button>
                                    </Popconfirm>
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.employeeId?.avatar}>{item.employeeId?.name?.[0]}</Avatar>}
                                title={<Text strong>{item.employeeId?.name}</Text>}
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{item.leaveType} | {dayjs(item.startDate).format('MMM D')} - {dayjs(item.endDate).format('MMM D')}</Text>
                                        <Text style={{ fontSize: 13 }}>{item.reason}</Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

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
        </>
    );
};

export default PendingApprovals;
