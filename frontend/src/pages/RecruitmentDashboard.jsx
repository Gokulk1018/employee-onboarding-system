import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Input, Button, Space, Badge, theme, App, Statistic, Card, Select, Popconfirm } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ProjectOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import JobPostingDrawer from '../components/recruitment/JobPostingDrawer';
import JobList from '../components/recruitment/JobList';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSessionJobs } from '../data/mockRecruitmentData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const RecruitmentDashboard = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = App.useApp();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    React.useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await api.get('/jobs');
                if (response.data.success) {
                    setJobs(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                setJobs(getSessionJobs());
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('action') === 'add') {
            setIsDrawerOpen(true);
        }
    }, [location]);

    const [filterStatus, setFilterStatus] = useState('ALL');
    const [viewType, setViewType] = useState('grid');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // --- Google Form / AI ATS Candidates ---
    const [formCandidates, setFormCandidates] = useState([]);
    const [formCandidatesLoading, setFormCandidatesLoading] = useState(true);

    useEffect(() => {
        const fetchFormCandidates = async () => {
            setFormCandidatesLoading(true);
            try {
                const res = await api.get('/candidates');
                if (res.data.success) {
                    setFormCandidates(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch form candidates:', err);
            } finally {
                setFormCandidatesLoading(false);
            }
        };
        fetchFormCandidates();
    }, []);

    const handleDeleteCandidate = async (id) => {
        try {
            await api.delete(`/candidates/${id}`);
            setFormCandidates(prev => prev.filter(c => c._id !== id));
            message.success('Candidate deleted successfully');
        } catch (err) {
            message.error('Failed to delete candidate');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
            job.department.toLowerCase().includes(searchText.toLowerCase());
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
                        <Card variant="borderless" className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic title="Total Openings" value={jobs.length} prefix={<ProjectOutlined style={{ color: token.colorPrimary }} />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card variant="borderless" className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic title="Active Jobs" value={activeJobsCount} prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card variant="borderless" className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic title="Total Applied" value={totalApplicants} prefix={<UserOutlined style={{ color: token.colorInfo }} />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card variant="borderless" className="glass-card" style={{ borderRadius: 16 }}>
                            <Statistic
                                title="Deadline Soon"
                                value={jobs.filter(j => { const diff = dayjs(j.applicationDeadline).diff(dayjs(), 'day'); return diff > 0 && diff < 7; }).length}
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
                                    <Select defaultValue="ALL" style={{ width: 120, borderRadius: 10 }} onChange={setFilterStatus}>
                                        <Select.Option value="ALL">All States</Select.Option>
                                        <Select.Option value="OPEN">Open</Select.Option>
                                        <Select.Option value="CLOSED">Closed</Select.Option>
                                    </Select>
                                </Space>
                                <Space className="glass-card" style={{ padding: '4px 8px', borderRadius: 10 }}>
                                    <Button type="text" icon={<AppstoreOutlined />} onClick={() => setViewType('grid')}
                                        style={{ color: viewType === 'grid' ? token.colorPrimary : 'inherit', opacity: viewType === 'grid' ? 1 : 0.5 }} />
                                    <Button type="text" icon={<UnorderedListOutlined />} onClick={() => setViewType('list')}
                                        style={{ color: viewType === 'list' ? token.colorPrimary : 'inherit', opacity: viewType === 'list' ? 1 : 0.5 }} />
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={filterStatus + searchText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <JobList jobs={filteredJobs} viewType={viewType} onJobClick={(id) => navigate(`/recruitment/jobs/${id}`)} />
                    </motion.div>
                </AnimatePresence>

                {/* ── 🤖 Google Form / Gemini AI ATS Applications ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ marginTop: 48 }}
                >
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Title level={4} style={{ margin: 0 }}>🤖 Gemini AI ATS — Google Form Applications</Title>
                        <span style={{
                            background: token.colorPrimary,
                            color: '#fff',
                            borderRadius: 20,
                            padding: '1px 10px',
                            fontSize: 12,
                            fontWeight: 700
                        }}>{formCandidates.length}</span>
                    </div>

                    {formCandidatesLoading ? (
                        <Card className="glass-card" style={{ borderRadius: 16, textAlign: 'center', padding: 32 }}>
                            <Text type="secondary">Loading AI-evaluated candidates...</Text>
                        </Card>
                    ) : formCandidates.length === 0 ? (
                        <Card className="glass-card" style={{ borderRadius: 16, textAlign: 'center', padding: 48 }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                            <Title level={5} style={{ color: token.colorTextTertiary }}>No Applications Yet</Title>
                            <Text type="secondary">
                                Candidates who submit through the Google Form will appear here automatically with their Gemini AI ATS scores.
                            </Text>
                        </Card>
                    ) : (
                        <Card className="glass-card" style={{ borderRadius: 16, padding: 0, overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                            {['Candidate', 'Email', 'Target Role', '⚡ ATS Score', 'Recommendation', 'Experience', 'Resume', 'Action'].map(h => (
                                                <th key={h} style={{
                                                    padding: '12px 16px',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: token.colorTextSecondary,
                                                    textAlign: 'left',
                                                    whiteSpace: 'nowrap',
                                                    background: token.colorFillAlter
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formCandidates.map((c, idx) => {
                                            const score = c.atsScore || 0;
                                            const scoreColor = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
                                            return (
                                                <tr key={c._id} style={{
                                                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                                    background: idx % 2 === 0 ? token.colorBgContainer : token.colorFillAlter,
                                                    transition: 'background 0.2s'
                                                }}>
                                                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                                                    <td style={{ padding: '14px 16px', color: token.colorTextSecondary, fontSize: 13 }}>{c.email}</td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{
                                                            background: `${token.colorPrimary}18`,
                                                            color: token.colorPrimary,
                                                            borderRadius: 6,
                                                            padding: '2px 10px',
                                                            fontSize: 12,
                                                            fontWeight: 700
                                                        }}>{c.targetRole || 'N/A'}</span>
                                                    </td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{
                                                            background: `${scoreColor}18`,
                                                            color: scoreColor,
                                                            border: `1px solid ${scoreColor}`,
                                                            borderRadius: 8,
                                                            padding: '3px 12px',
                                                            fontSize: 13,
                                                            fontWeight: 700
                                                        }}>⚡ {score}%</span>
                                                    </td>
                                                    <td style={{ padding: '14px 16px', fontSize: 12, color: token.colorTextSecondary }}>{c.hiringRecommendation || '—'}</td>
                                                    <td style={{ padding: '14px 16px', fontSize: 12, color: token.colorTextSecondary }}>{c.experience || '—'}</td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        {c.resumeUrl && c.resumeUrl !== 'N/A' && c.resumeUrl !== 'https://drive.google.com' ? (
                                                            <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                                style={{ color: token.colorPrimary, fontSize: 12, fontWeight: 600 }}>
                                                                📄 View PDF
                                                            </a>
                                                        ) : (
                                                            <span style={{ color: token.colorTextTertiary, fontSize: 12 }}>—</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <Popconfirm
                                                            title="Delete Candidate?"
                                                            description="This action cannot be undone."
                                                            onConfirm={() => handleDeleteCandidate(c._id)}
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
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </motion.div>

                <JobPostingDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSuccess={(newJob) => {
                        setIsDrawerOpen(false);
                        setJobs(prevJobs => [newJob, ...prevJobs]);
                    }}
                />
            </motion.div>
        </PageContainer>
    );
};

export default RecruitmentDashboard;
