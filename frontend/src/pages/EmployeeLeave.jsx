import React, { useState } from 'react';
import {
    Card, Row, Col, Typography, Form, Input,
    DatePicker, Select, Button, Table, Tag,
    Space, Divider, theme, Statistic, App
} from 'antd';
import {
    SendOutlined, HistoryOutlined, CalendarOutlined,
    InfoCircleOutlined, ClockCircleOutlined, CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const EmployeeLeave = () => {
    const { token } = theme.useToken();
    const { message: msg } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Mock leave history
    const [history] = useState([
        {
            key: '1',
            type: 'Vacation',
            range: ['2026-03-10', '2026-03-15'],
            days: 5,
            status: 'Approved',
            reason: 'Annual family trip',
            appliedAt: '2026-02-15'
        },
        {
            key: '2',
            type: 'Sick Leave',
            range: ['2026-02-05', '2026-02-06'],
            days: 2,
            status: 'Approved',
            reason: 'Flu',
            appliedAt: '2026-02-04'
        },
        {
            key: '3',
            type: 'Casual',
            range: ['2026-03-20', '2026-03-20'],
            days: 1,
            status: 'Pending',
            reason: 'Personal work',
            appliedAt: '2026-02-19'
        }
    ]);

    const onFinish = (values) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            msg.success('Leave application submitted successfully!');
            form.resetFields();
            setLoading(false);
        }, 1500);
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
        }
    ];

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
                        <Card className="glass-card" style={{ borderRadius: 24 }}>
                            <Title level={4}><InfoCircleOutlined /> Leave Balance</Title>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="Annual" value={14} suffix="/ 18" valueStyle={{ color: token.colorPrimary }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Sick" value={8} suffix="/ 12" valueStyle={{ color: token.colorSuccess }} />
                                </Col>
                            </Row>
                            <div style={{ marginTop: 24 }}>
                                <Statistic title="Casual" value={3} suffix="/ 5" />
                            </div>
                        </Card>

                        <Card
                            className="glass-card"
                            style={{ borderRadius: 24, background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)' }}
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
                                            <Select.Option value="vacation">Vacation</Select.Option>
                                            <Select.Option value="sick">Sick Leave</Select.Option>
                                            <Select.Option value="casual">Casual Leave</Select.Option>
                                            <Select.Option value="maternity">Maternity/Paternity</Select.Option>
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
                            className="custom-table"
                        />
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default EmployeeLeave;
