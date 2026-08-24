import React from 'react';
import { Row, Col, Table, Tag, Button, theme, Typography, Popconfirm, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import JobCard from './JobCard';
import dayjs from 'dayjs';

const { Text } = Typography;

const JobList = ({ jobs, onJobClick, onDeleteJob, viewType = 'grid' }) => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text, record) => <Text strong style={{ fontSize: 14 }}>{text}</Text>
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (dept) => (
                <Tag bordered={false} style={{ borderRadius: 6, background: `${token.colorPrimary}10`, color: token.colorPrimary }}>
                    {dept}
                </Tag>
            )
        },
        {
            title: 'Type',
            dataIndex: 'jobType',
            key: 'jobType',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Openings',
            dataIndex: 'openings',
            key: 'openings',
            align: 'center',
            render: (val) => <Text strong>{val}</Text>
        },
        {
            title: 'Applied',
            dataIndex: 'appliedCount',
            key: 'appliedCount',
            align: 'center',
            render: (val) => <Text strong>{val || 0}</Text>
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const isDeadlinePassed = dayjs().isAfter(dayjs(record.applicationDeadline));
                const status = isDeadlinePassed ? 'CLOSED' : 'OPEN';
                return (
                    <Tag color={status === 'OPEN' ? 'success' : 'error'} bordered={false}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => onJobClick(record._id)}
                        style={{ borderRadius: 6 }}
                    >
                        View
                    </Button>
                    <Popconfirm
                        title="Delete Job?"
                        description="This will also delete all applied candidates."
                        onConfirm={() => onDeleteJob(record._id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            style={{ color: '#ef4444' }}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    if (viewType === 'list') {
        return (
            <div className="glass-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <Table
                    dataSource={jobs}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    className="custom-table"
                />
            </div>
        );
    }

    return (
        <Row gutter={[24, 24]}>
            {jobs.map(job => (
                <Col xs={24} md={12} lg={8} xl={6} key={job._id}>
                    <JobCard
                        job={job}
                        onClick={() => onJobClick(job._id)}
                        onDeleteJob={onDeleteJob}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default JobList;
