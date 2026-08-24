import React from 'react';
import { Card, Typography, Tag, Space, Button, theme, Badge, Popconfirm } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, UserOutlined, DollarOutlined, ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const JobCard = ({ job, onClick, onDeleteJob }) => {
    const { token } = theme.useToken();

    // Logic for dynamic status
    const isDeadlinePassed = dayjs().isAfter(dayjs(job.applicationDeadline));
    const status = isDeadlinePassed ? 'CLOSED' : 'OPEN';
    const statusColor = status === 'OPEN' ? token.colorSuccess : token.colorError;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ height: '100%' }}
        >
            <Card
                className="glass-card recruitment-job-card"
                style={{
                    borderRadius: 20,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgContainer,
                    overflow: 'hidden',
                    minWidth: 280, // ensures card doesn't shrink too much on mobile
                    flex: '1 1 auto',
                }}
                styles={{ body: { padding: 24, flex: 1, display: 'flex', flexDirection: 'column' } }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <Tag
                        bordered={false}
                        style={{
                            borderRadius: 8,
                            padding: '4px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            background: `${token.colorPrimary}15`,
                            color: token.colorPrimary
                        }}
                    >
                        {job.department}
                    </Tag>
                    <Space size="middle" align="center">
                        <Badge
                            status={status === 'OPEN' ? 'processing' : 'default'}
                            text={
                                <Text strong style={{ color: statusColor, fontSize: 11, textTransform: 'uppercase' }}>
                                    {status}
                                </Text>
                            }
                        />
                        {onDeleteJob && (
                            <Popconfirm
                                title="Delete Job?"
                                description="This will also delete applied candidates."
                                onConfirm={(e) => {
                                    e.stopPropagation();
                                    onDeleteJob(job._id);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ color: '#ef4444', padding: 0 }}
                                />
                            </Popconfirm>
                        )}
                    </Space>
                </div>

                <Title level={4} style={{ margin: '0 0 12px 0', fontSize: 20 }}>{job.jobTitle}</Title>

                <Space direction="vertical" size={12} style={{ flex: 1, marginBottom: 20 }}>
                    <Space size={8} style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                        <EnvironmentOutlined />
                        <Text type="secondary">{job.location}</Text>
                        <Text type="secondary" style={{ opacity: 0.5 }}>•</Text>
                        <Text type="secondary">{job.jobType}</Text>
                    </Space>

                    <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                        <div style={{ flex: 1 }}>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>OPENINGS</Text>
                            <Space size={4}>
                                <UserOutlined style={{ fontSize: 12 }} />
                                <Text strong>{job.openings}</Text>
                            </Space>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>APPLIED</Text>
                            <Space size={4}>
                                <UserOutlined style={{ fontSize: 12 }} />
                                <Text strong>{job.appliedCount || 0}</Text>
                            </Space>
                        </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <Space size={4} style={{ color: token.colorTextSecondary }}>
                            <ClockCircleOutlined style={{ fontSize: 12 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>Deadline:</Text>
                            <Text style={{ fontSize: 12, color: isDeadlinePassed ? token.colorError : token.colorText }}>
                                {dayjs(job.applicationDeadline).format('MMM DD, YYYY')}
                            </Text>
                        </Space>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <DollarOutlined style={{ color: token.colorSuccess }} />
                        <Text strong style={{ color: token.colorSuccess }}>{job.salaryRange}</Text>
                    </div>
                </Space>

                <Button
                    type="primary"
                    block
                    icon={<ArrowRightOutlined />}
                    onClick={onClick}
                    style={{
                        borderRadius: 12,
                        height: 44,
                        fontWeight: 600,
                        background: token.colorPrimary,
                        border: 'none',
                        marginTop: 'auto'
                    }}
                >
                    View Details
                </Button>
            </Card>
        </motion.div>
    );
};

export default JobCard;
