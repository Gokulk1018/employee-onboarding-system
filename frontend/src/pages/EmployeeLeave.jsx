import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, Row, Col, Typography, Form, Input,
    DatePicker, Select, Button, Table, Tag,
    Space, Divider, theme, Statistic, App, Popconfirm
} from 'antd';
import {
    SendOutlined, HistoryOutlined, CalendarOutlined,
    InfoCircleOutlined, ClockCircleOutlined, CheckCircleOutlined,
    CloseCircleOutlined, DeleteOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';
import { getEmployeeById } from '../services/employeeService';
import { applyLeave, getMyLeaves, cancelLeave } from '../services/leaveService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const EmployeeLeave = () => {
    const { token } = theme.useToken();
    const { message: msg } = App.useApp();
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [history, setHistory] = useState([]);
    const [employee, setEmployee] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setFetching(true);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                msg.error('User not identified. Please login again.');
                return;
            }

            const [empRes, leavesRes] = await Promise.all([
                getEmployeeById(userId),
                getMyLeaves(userId)
            ]);

            setEmployee(empRes.data);
            setHistory(leavesRes.data.map(item => ({
                ...item,
                key: item._id,
                range: [item.startDate, item.endDate],
                days: dayjs(item.endDate).diff(dayjs(item.startDate), 'day') + 1,
                type: item.leaveType,
                appliedAt: item.appliedOn
            })));
        } catch (error) {
            console.error('Fetch error:', error);
            msg.error('Failed to fetch leave data');
        } finally {
            setFetching(false);
        }
    }, [msg]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const leaveData = {
                employeeId: userId,
                leaveType: values.type.charAt(0).toUpperCase() + values.type.slice(1), // Convert 'vacation' to 'Vacation' (or handled by backend enum)
                startDate: values.range[0].format('YYYY-MM-DD'),
                endDate: values.range[1].format('YYYY-MM-DD'),
                reason: values.reason
            };

            // Fix for 'vacation' -> 'Annual' mapping if needed, let's check backend enum
            // Backend enum: ['Annual', 'Sick', 'Casual']
            if (leaveData.leaveType === 'Vacation') leaveData.leaveType = 'Annual';

            await applyLeave(leaveData);
            msg.success('Leave application submitted successfully!');
            form.resetFields();
            fetchData(); // Refresh history and balance
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to submit application';
            msg.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await cancelLeave(id);
            msg.success('Leave application cancelled and deleted.');
            fetchData();
        } catch (error) {
            msg.error('Failed to cancel leave');
        }
    };

    const columns = [
        {
            title: 'Leave Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Period',
            key: 'period',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text size="small">{dayjs(record.range[0]).format('MMM D')} - {dayjs(record.range[1]).format('MMM D, YYYY')}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.days} Days</Text>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'gold';
                let icon = <ClockCircleOutlined />;
                if (status === 'Approved') { color = 'green'; icon = <CheckCircleOutlined />; }
                if (status === 'Rejected') { color = 'red'; icon = <CloseCircleOutlined />; }
                return <Tag icon={icon} color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
        },
        {
            title: 'Applied On',
            dataIndex: 'appliedAt',
            key: 'appliedAt',
            render: (date) => dayjs(date).format('MMM D, YYYY')
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                record.status === 'Pending' ? (
                    <Popconfirm
                        title="Cancel Leave"
                        description="Are you sure you want to cancel and delete this request?"
                        onConfirm={() => handleCancel(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />}>Cancel</Button>
                    </Popconfirm>
                ) : null
            )
        }
    ];

    const balances = employee?.leaveBalance || { annual: 0, sick: 0, casual: 0 };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div style={{ marginBottom: 32 }}>
                <Title level={2}>Leave Application</Title>
                <Text type="secondary">Request time off and track your leave balance</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size={24}>
                        <Card className="glass-card" style={{ borderRadius: 24 }} loading={fetching}>
                            <Title level={4}><InfoCircleOutlined /> Leave Balance</Title>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="Annual" value={balances.annual} suffix="/ 18" valueStyle={{ color: token.colorPrimary }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Sick" value={balances.sick} suffix="/ 12" valueStyle={{ color: token.colorSuccess }} />
                                </Col>
                            </Row>
                            <div style={{ marginTop: 24 }}>
                                <Statistic title="Casual" value={balances.casual} suffix="/ 5" />
                            </div>
                        </Card>

                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 24,
                                background: isDarkMode
                                    ? 'linear-gradient(135deg, rgba(24, 144, 255, 0.4) 114%, rgba(114, 46, 209, 0.4) 100%)'
                                    : 'linear-gradient(135deg, #4f46e5 0%, #722ed1 100%)'
                            }}
                            styles={{ body: { color: '#fff' } }}
                        >
                            <Title level={4} style={{ color: '#fff' }}><SendOutlined /> Quick Request</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Planning a break? Submit your request and we'll notify your manager.
                            </Text>
                            <div style={{ marginTop: 20 }}>
                                <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: 'none' }}>#WorkLifeBalance</Tag>
                                <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: 'none' }}>#TimeOff</Tag>
                            </div>
                        </Card>
                    </Space>
                </Col>

                <Col xs={24} lg={16}>
                    <Card className="glass-card" style={{ borderRadius: 24 }} title="New Application">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="type" label="Leave Type" rules={[{ required: true }]}>
                                        <Select placeholder="Select type">
                                            <Select.Option value="annual">Vacation (Annual)</Select.Option>
                                            <Select.Option value="sick">Sick Leave</Select.Option>
                                            <Select.Option value="casual">Casual Leave</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="range" label="Select Period" rules={[{ required: true }]}>
                                        <RangePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="reason" label="Reason for Leave" rules={[{ required: true }]}>
                                        <Input.TextArea rows={4} placeholder="Briefly describe the reason for your leave..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                                style={{ borderRadius: 12, height: 48 }}
                            >
                                Submit Application
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        className="glass-card"
                        style={{ borderRadius: 24 }}
                        title={<Space><HistoryOutlined /> Leave History</Space>}
                    >
                        <Table
                            columns={columns}
                            dataSource={history}
                            pagination={false}
                            loading={fetching}
                            className="custom-table"
                        />
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default EmployeeLeave;
