import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Avatar, Tag, Button, Typography, Space, Empty, Spin, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const LeaveManagementModal = ({ open, onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [leaves, setLeaves] = useState([]);

    const fetchAllLeaves = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leaves/all`);
            if (response.data.success) {
                setLeaves(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching all leaves:', error);
            message.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchAllLeaves();
        }
    }, [open]);

    const handleLeaveAction = async (id, status) => {
        try {
            setActionLoading(id);
            const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leaves/${id}/status`, { status });
            if (response.data.success) {
                message.success(`Leave request ${status.toLowerCase()} successfully`);
                fetchAllLeaves();
                if (onRefresh) onRefresh();
            }
        } catch (error) {
            console.error('Error updating leave status:', error);
            message.error('Failed to update leave request');
        } finally {
            setActionLoading(null);
        }
    };

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const historyLeaves = leaves.filter(l => l.status !== 'Pending');

    const renderLeaveItem = (item, showActions = false) => (
        <List.Item
            key={item._id}
            actions={showActions ? [
                <Space key="actions">
                    <Popconfirm title="Approve leave?" onConfirm={() => handleLeaveAction(item._id, 'Approved')}>
                        <Button type="primary" size="small" icon={<CheckOutlined />} loading={actionLoading === item._id}>Approve</Button>
                    </Popconfirm>
                    <Popconfirm title="Reject leave?" onConfirm={() => handleLeaveAction(item._id, 'Rejected')}>
                        <Button danger size="small" icon={<CloseOutlined />} loading={actionLoading === item._id}>Reject</Button>
                    </Popconfirm>
                </Space>
            ] : [
                <Tag key="status" color={item.status === 'Approved' ? 'success' : 'error'} style={{ borderRadius: 12 }}>
                    {item.status}
                </Tag>
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src={item.employeeId?.avatar} icon={<UserOutlined />} />}
                title={
                    <Space>
                        <Text strong>{item.employeeId?.name || 'Unknown Employee'}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>({item.employeeId?.department})</Text>
                    </Space>
                }
                description={
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                        <Space style={{ fontSize: 12, color: '#666' }}>
                            <CalendarOutlined />
                            <Text>{dayjs(item.startDate).format('MMM D, YYYY')} - {dayjs(item.endDate).format('MMM D, YYYY')}</Text>
                            <Tag color="blue" size="small">{item.leaveType}</Tag>
                        </Space>
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary" italic style={{ fontSize: 13 }}>"{item.reason || 'No reason provided'}"</Text>
                        </div>
                        {item.status === 'Pending' && (
                            <div style={{ marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Applied on: {dayjs(item.appliedOn).format('MMM D, h:mm A')}</Text>
                            </div>
                        )}
                    </Space>
                }
            />
        </List.Item>
    );

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Leave Management</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            className="glass-modal"
            centered
        >
            <Tabs defaultActiveKey="pending" items={[
                {
                    key: 'pending',
                    label: `Pending Requests (${pendingLeaves.length})`,
                    children: (
                        <List
                            loading={loading}
                            dataSource={pendingLeaves}
                            locale={{ emptyText: <Empty description="No pending leave requests" /> }}
                            renderItem={item => renderLeaveItem(item, true)}
                            style={{ maxHeight: 500, overflowY: 'auto' }}
                        />
                    )
                },
                {
                    key: 'history',
                    label: 'Leave History',
                    children: (
                        <List
                            loading={loading}
                            dataSource={historyLeaves}
                            locale={{ emptyText: <Empty description="No leave history available" /> }}
                            renderItem={item => renderLeaveItem(item, false)}
                            style={{ maxHeight: 500, overflowY: 'auto' }}
                        />
                    )
                }
            ]} />
        </Modal>
    );
};

export default LeaveManagementModal;
