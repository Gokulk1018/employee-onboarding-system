import React, { useState } from 'react';
import { Typography, Row, Col, Input, Button, Space, Badge, theme, App, Statistic, Card, Select } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    FilterOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import JobPostingDrawer from '../components/recruitment/JobPostingDrawer';
import JobList from '../components/recruitment/JobList';
import { useNavigate } from 'react-router-dom';
import { getSessionJobs, saveSessionJobs } from '../data/mockRecruitmentData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const RecruitmentDashboard = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { message } = App.useApp();

    // Using session-aware state for mock data
    const [jobs, setJobs] = useState(() => getSessionJobs());
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
            job.department.toLowerCase().includes(searchText.toLowerCase());

        // Status logic
        const isDeadlinePassed = dayjs().isAfter(dayjs(job.applicationDeadline));
        const currentStatus = isDeadlinePassed ? 'CLOSED' : 'OPEN';

        const matchesStatus = filterStatus === 'ALL' || currentStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const activeJobsCount = jobs.filter(j => dayjs().isBefore(dayjs(j.applicationDeadline))).length;
    const totalApplicants = jobs.reduce((acc, job) => acc + (job.appliedCount || 0), 0);

    return (
        <PageContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: 32 }}>
                    <Row gutter={[24, 24]} align="middle" justify="space-between">
                        <Col>
                            <Title level={2} style={{ margin: 0 }} className="text-gradient">Recruitment Dashboard</Title>
                            <Text type="secondary">Manage your company's job openings and evaluate potential talent</Text>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => setIsDrawerOpen(true)}
                                style={{ borderRadius: 12, height: 48, padding: '0 24px', fontWeight: 600 }}
                            >
                                Post New Job
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic
                                title="Total Openings"
                                value={jobs.length}
                                prefix={<ProjectOutlined style={{ color: token.colorPrimary }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic
                                title="Active Jobs"
                                value={activeJobsCount}
                                prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic
                                title="Total Applied"
                                value={totalApplicants}
                                prefix={<UserOutlined style={{ color: token.colorInfo }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic
                                title="Deadline Soon"
                                value={jobs.filter(j => {
                                    const diff = dayjs(j.applicationDeadline).diff(dayjs(), 'day');
                                    return diff > 0 && diff < 7;
                                }).length}
                                prefix={<Badge status="warning" />}
                            />
                        </Card>
                    </Col>
                </Row>

                <div className="glass-card" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12}>
                            <Input
                                placeholder="Search roles, departments, or keywords..."
                                prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                                size="large"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ borderRadius: 12 }}
                            />
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                            <Space size="middle">
                                <Space size={8}>
                                    <Text type="secondary">Status:</Text>
                                    <Select
                                        defaultValue="ALL"
                                        style={{ width: 120, borderRadius: 10 }}
                                        onChange={setFilterStatus}
                                        className="custom-select"
                                    >
                                        <Select.Option value="ALL">All States</Select.Option>
                                        <Select.Option value="OPEN">Open</Select.Option>
                                        <Select.Option value="CLOSED">Closed</Select.Option>
                                    </Select>
                                </Space>
                                <Space className="glass-card" style={{ padding: '4px 8px', borderRadius: 10 }}>
                                    <Button type="text" icon={<AppstoreOutlined />} className="text-primary" />
                                    <Button type="text" icon={<UnorderedListOutlined />} style={{ opacity: 0.5 }} />
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={filterStatus + searchText}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <JobList
                            jobs={filteredJobs}
                            onJobClick={(id) => navigate(`/recruitment/jobs/${id}`)}
                        />
                    </motion.div>
                </AnimatePresence>

                <JobPostingDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSuccess={(newJob) => {
                        setIsDrawerOpen(false);
                        const updatedJobs = [newJob, ...jobs];
                        setJobs(updatedJobs);
                        saveSessionJobs(updatedJobs);
                    }}
                />
            </motion.div>
        </PageContainer>
    );
};

export default RecruitmentDashboard;
