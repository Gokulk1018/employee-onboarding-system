import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Typography, Tag, Button,
    Space, message, List, Avatar, Input, Empty,
    Divider, theme, Badge
} from 'antd';
import {
    SearchOutlined, FilterOutlined, RocketOutlined,
    EnvironmentOutlined, BankOutlined, DollarOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const JobPortal = () => {
    const { token } = theme.useToken();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/jobs`);
                if (response.data.success) {
                    // Only show OPEN jobs to employees
                    setJobs(response.data.data.filter(j => j.status === 'OPEN'));
                }
            } catch (error) {
                message.error('Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2}>Internal Careers</Title>
                    <Text type="secondary">Explore new opportunities and grow your career within the organization</Text>
                </div>
                <Badge count={filteredJobs.length} overflowCount={99} color={token.colorPrimary}>
                    <Button type="primary" icon={<RocketOutlined />} style={{ borderRadius: 10 }}>My Applications</Button>
                </Badge>
            </div>

            <Card className="glass-card" style={{ marginBottom: 24, borderRadius: 20 }}>
                <Row gutter={16}>
                    <Col xs={24} md={18}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search by job title, department, or keywords..."
                            size="large"
                            style={{ borderRadius: 12 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Button block size="large" icon={<FilterOutlined />} style={{ borderRadius: 12 }}>
                            Advanced Filters
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <Col xs={24} md={12} lg={8} key={job._id}>
                            <motion.div whileHover={{ y: -5 }}>
                                <Card
                                    className="glass-card"
                                    style={{ borderRadius: 24, height: '100%' }}
                                    styles={{ body: { padding: 24 } }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <Avatar
                                            size={48}
                                            icon={<BankOutlined />}
                                            style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }}
                                        />
                                        <Tag color="blue">{job.jobType || 'Full-time'}</Tag>
                                    </div>

                                    <Title level={4} style={{ margin: '0 0 4px 0' }}>{job.jobTitle}</Title>
                                    <Text strong type="secondary">{job.department}</Text>

                                    <Divider style={{ margin: '16px 0' }} />

                                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                        <Space><EnvironmentOutlined /> <Text type="secondary">{job.location}</Text></Space>
                                        <Space><DollarOutlined /> <Text type="secondary">{job.salaryRange}</Text></Space>
                                    </Space>

                                    <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                                        <Button type="primary" block style={{ borderRadius: 10 }}>Apply Now</Button>
                                        <Button block icon={<ArrowRightOutlined />} style={{ borderRadius: 10 }}>Details</Button>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))
                ) : (
                    <Col span={24}>
                        <Empty description="No matching job opportunities found" style={{ padding: '60px 0' }} />
                    </Col>
                )}
            </Row>
        </motion.div>
    );
};

export default JobPortal;
