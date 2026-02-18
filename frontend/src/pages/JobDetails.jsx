import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Typography, Space, Divider, List, Avatar, message as antdMessage, Spin, Modal, Form, Input, InputNumber, DatePicker, Select, App, Breadcrumb, Descriptions } from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, ShareAltOutlined, PlusOutlined,
    InstagramOutlined, LinkedinOutlined, WhatsAppOutlined, MailOutlined, CopyOutlined, GlobalOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import RecruitmentKanban from '../components/recruitment/RecruitmentKanban';
import CandidateTable from '../components/recruitment/CandidateTable';
import { getSessionJobs, updateSessionCandidates, getSessionCandidates } from '../data/mockRecruitmentData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const INITIAL_MOCK_CANDIDATES = [
    { _id: "m1", name: "Alice Johnson", email: "alice@mail.com", experience: "2 yrs", skills: ["React", "JS"], stage: "Applied", status: "In Progress", resumeUrl: "#" },
    { _id: "m2", name: "Bob Smith", email: "bob@mail.com", experience: "4 yrs", skills: ["Node", "MongoDB"], stage: "Screening", status: "In Progress", resumeUrl: "#" },
    { _id: "m3", name: "Charlie Lee", email: "charlie@mail.com", experience: "5 yrs", skills: ["AWS", "Docker"], stage: "Technical Round", status: "In Progress", resumeUrl: "#" },
    { _id: "m4", name: "David Kumar", email: "david@mail.com", experience: "3 yrs", skills: ["CI/CD", "Terraform"], stage: "HR Interview", status: "In Progress", resumeUrl: "#" },
    { _id: "m5", name: "Eva Brown", email: "eva@mail.com", experience: "1 yr", skills: ["HTML", "CSS"], stage: "Applied", status: "In Progress", resumeUrl: "#" },
    { _id: "m6", name: "Frank Chen", email: "frank@mail.com", experience: "6 yrs", skills: ["Kubernetes", "Linux"], stage: "Screening", status: "In Progress", resumeUrl: "#" }
];

const JobDetails = () => {
    const { message } = App.useApp();
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const [job, setJob] = useState(null);
    const [realCandidates, setRealCandidates] = useState([]);
    const [mocks, setMocks] = useState(INITIAL_MOCK_CANDIDATES);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Edit Job Modal State
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [editing, setEditing] = useState(false);

    // Share Modal State
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [sharingPlatform, setSharingPlatform] = useState(null);

    // Helper function to check if ID is a valid MongoDB ObjectId
    const isValidMongoId = (id) => {
        return id && typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
    };

    useEffect(() => {
        const fetchJobAndCandidates = async () => {
            // Validate ID before fetching
            if (!isValidMongoId(id)) {
                console.warn("Invalid MongoDB ID, skipping backend fetch:", id);
                // Fallback to mock immediately
                const allJobs = getSessionJobs();
                const foundJob = allJobs.find(j => j._id === id);

                if (foundJob) {
                    setJob(foundJob);
                    setRealCandidates(getSessionCandidates(id) || []); // Load mock candidates for this job
                } else {
                    message.error('Job not found');
                    navigate('/recruitment');
                }
                setLoading(false);
                return;
            }

            try {
                // Fetch job and candidates in parallel for better performance
                const [jobResult, candidatesResult] = await Promise.allSettled([
                    fetch(`http://localhost:5000/api/jobs/${id}`).then(res => res.json()),
                    fetch(`http://localhost:5000/api/jobs/${id}/candidates`).then(res => res.json())
                ]);

                // Handle job data
                if (jobResult.status === 'fulfilled' && jobResult.value.success) {
                    setJob(jobResult.value.data);
                    setLoading(false); // Show UI immediately once job is loaded
                } else {
                    // Fallback to mock if API returns error
                    const allJobs = getSessionJobs();
                    const foundJob = allJobs.find(j => j._id === id);

                    if (foundJob) {
                        setJob(foundJob);
                        setLoading(false); // Show UI immediately
                    } else {
                        message.error('Job not found');
                        navigate('/recruitment');
                        return;
                    }
                }

                // Handle candidates data (can load after UI is shown)
                if (candidatesResult.status === 'fulfilled' && candidatesResult.value.success) {
                    setRealCandidates(candidatesResult.value.data);
                } else {
                    console.error("Failed to fetch real candidates", candidatesResult.reason);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                // Try fallback to mock data
                const allJobs = getSessionJobs();
                const foundJob = allJobs.find(j => j._id === id);

                if (foundJob) {
                    setJob(foundJob);
                } else {
                    message.error('Job not found');
                    navigate('/recruitment');
                }
                setLoading(false);
            }
        };

        fetchJobAndCandidates();
    }, [id, navigate, message]);

    // 3. MERGED VIEW
    const allCandidates = [...mocks, ...realCandidates];

    const handleEditJob = async (values) => {
        setEditing(true);
        try {
            // Check if this is a real database job or a fake frontend job
            if (isValidMongoId(id)) {
                // Real MongoDB job - call backend API
                const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                const data = await response.json();

                if (data.success) {
                    message.success('Job updated successfully');
                    setJob(data.data);
                    setIsEditModalVisible(false);
                } else {
                    message.error(data.message || 'Failed to update job');
                }
            } else {
                // Fake frontend job - update local state only
                const updatedJob = {
                    ...job,
                    ...values,
                    applicationDeadline: values.applicationDeadline ? values.applicationDeadline.toISOString() : job.applicationDeadline
                };
                setJob(updatedJob);

                // Also update in session storage if using mock data
                const allJobs = getSessionJobs();
                const updatedJobs = allJobs.map(j => j._id === id ? updatedJob : j);
                sessionStorage.setItem('mockJobs', JSON.stringify(updatedJobs));

                message.success('Job updated successfully (local)');
                setIsEditModalVisible(false);
            }
        } catch (error) {
            message.error('Error updating job');
            console.error(error);
        } finally {
            setEditing(false);
        }
    };

    const openEditModal = () => {
        if (job) {
            editForm.setFieldsValue({
                ...job,
                applicationDeadline: dayjs(job.applicationDeadline)
            });
            setIsEditModalVisible(true);
        }
    };

    const handleStageUpdate = async (candidateId, newStage) => {
        const isMock = candidateId.startsWith('m');

        if (isMock) {
            setMocks(prev => prev.map(c => c._id === candidateId ? { ...c, stage: newStage } : c));
            message.success(`Candidate moved to ${newStage}`);
            return;
        }

        // For real candidates, call API
        try {
            const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}/stage`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stage: newStage }),
            });
            const data = await response.json();

            if (data.success) {
                setRealCandidates(prev => prev.map(c => c._id === candidateId ? { ...c, stage: newStage } : c));
                message.success(`Candidate moved to ${newStage}`);
            } else {
                message.error(data.message || 'Failed to update stage');
            }
        } catch (error) {
            console.error('Error updating stage:', error);
            message.error('Failed to update stage');
        }
    };

    const handleAddCandidate = async (values) => {
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    experience: values.experience,
                    skills: values.skills.split(',').map(s => s.trim()), // Simple CSV parse
                    resumeUrl: values.resumeUrl || '#',
                    phone: values.phone || '0000000000' // Default if not requested in simple form
                }),
            });
            const data = await response.json();

            if (data.success) {
                message.success('Candidate added successfully');
                setRealCandidates(prev => [...prev, data.data]);
                setIsModalVisible(false);
                form.resetFields();
            } else {
                message.error(data.message || 'Failed to add candidate');
            }
        } catch (error) {
            message.error('Error adding candidate');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Share Logic
    const handlePlatformClick = async (platform) => {
        setSharingPlatform(platform.name);
        const url = window.location.href;

        // Simulating loading
        setTimeout(async () => {
            // Platform specific actions
            let shareUrl = '';
            switch (platform.name) {
                case 'LinkedIn':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    window.open(shareUrl, '_blank');
                    break;
                case 'WhatsApp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
                    window.open(shareUrl, '_blank');
                    break;
                case 'Email':
                    shareUrl = `mailto:?subject=Job Opening&body=${encodeURIComponent(url)}`;
                    window.location.href = shareUrl;
                    break;
                case 'Copy Link':
                    navigator.clipboard.writeText(url);
                    break;
                default:
                    // For Instagram/Others just open generic or show toast
                    if (platform.url) window.open(platform.url, '_blank');
                    break;
            }

            // Backend Notification
            try {
                await fetch('http://localhost:5000/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: "Job Shared",
                        message: `You shared ${job.jobTitle} job on ${platform.name}`,
                        type: "share"
                    })
                });
            } catch (err) {
                console.error("Failed to create notification", err);
            }

            message.success('Job post shared successfully!');
            setSharingPlatform(null);
            setIsShareModalVisible(false);

        }, 1000);
    };

    const sharePlatforms = [
        { name: 'Instagram', icon: <InstagramOutlined style={{ fontSize: 24, color: '#E1306C' }} /> },
        { name: 'LinkedIn', icon: <LinkedinOutlined style={{ fontSize: 24, color: '#0077B5' }} /> },
        { name: 'WhatsApp', icon: <WhatsAppOutlined style={{ fontSize: 24, color: '#25D366' }} /> },
        { name: 'Email', icon: <MailOutlined style={{ fontSize: 24, color: '#EA4335' }} /> },
        { name: 'Unstop', icon: <GlobalOutlined style={{ fontSize: 24, color: '#1890ff' }} /> },
        { name: 'Indeed', icon: <GlobalOutlined style={{ fontSize: 24, color: '#2164f3' }} /> },
        { name: 'Naukri', icon: <GlobalOutlined style={{ fontSize: 24, color: '#FFD700' }} /> },
        { name: 'Copy Link', icon: <CopyOutlined style={{ fontSize: 24, color: '#595959' }} /> },
    ];


    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
    if (!job) return null;

    const isDeadlinePassed = dayjs().isAfter(dayjs(job.applicationDeadline));
    const jobStatus = isDeadlinePassed ? 'CLOSED' : 'OPEN';

    // Stats configuration based on MERGED candidates
    const statsConfig = [
        { label: 'Total Applied', stage: 'ALL', color: '#1677ff' },
        { label: 'In Screening', stage: 'Screening', color: '#722ed1' },
        { label: 'Technical Round', stage: 'Technical Round', color: '#fa8c16' },
        { label: 'HR Interview', stage: 'HR Interview', color: '#fadb14' },
        { label: 'Selected', stage: 'Selected', color: '#52c41a' },
        { label: 'Rejected', stage: 'Rejected', color: '#f5222d' }
    ].filter(stat => {
        if (jobStatus === 'CLOSED') {
            return ['Selected', 'Rejected', 'ALL'].includes(stat.stage);
        }
        return true;
    });

    const activeStats = statsConfig.map(stat => {
        const count = stat.stage === 'ALL'
            ? allCandidates.length
            : allCandidates.filter(c => c.stage === stat.stage).length;

        return { ...stat, count };
    }).filter(s => s.count > 0);

    return (
        <PageContainer>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <Breadcrumb
                    style={{ marginBottom: 16 }}
                    items={[
                        { title: <a onClick={() => navigate('/recruitment')}>Recruitment</a> },
                        { title: job.jobTitle }
                    ]}
                />

                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <Space size={16}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/recruitment')}
                            type="text"
                        />
                        <div>
                            <Title level={3} style={{ margin: 0 }}>{job.jobTitle}</Title>
                            <Space size={8}>
                                <Text type="secondary">{job.department}</Text>
                                <Tag color={jobStatus === 'OPEN' ? 'success' : 'error'} bordered={false} style={{ borderRadius: 4, fontSize: 10 }}>
                                    {jobStatus}
                                </Tag>
                            </Space>
                        </div>
                    </Space>
                    <Space>
                        <Button icon={<ShareAltOutlined />} size="small" onClick={() => setIsShareModalVisible(true)}>Share</Button>
                        <Button type="primary" icon={<EditOutlined />} size="small" onClick={openEditModal}>Edit Job</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Candidate</Button>
                    </Space>
                </div>

                {/* Job Overview Stats Panel */}
                <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                    {activeStats.map(stat => (
                        <Col key={stat.label} xs={12} sm={8} md={4}>
                            <Card
                                size="small"
                                style={{
                                    borderRadius: 12,
                                    borderBottom: `3px solid ${stat.color}`,
                                    background: `${stat.color}05`
                                }}
                                styles={{ body: { padding: '12px 16px' } }}
                            >
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{stat.label}</Text>
                                <Title level={4} style={{ margin: 0, color: stat.color }}>{stat.count}</Title>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={18}>
                        <Card
                            title="Pipeline"
                            style={{ marginBottom: 24, borderRadius: 16 }}
                            styles={{ body: { padding: 20 } }}
                        >
                            <RecruitmentKanban
                                candidates={allCandidates}
                                onStageUpdate={handleStageUpdate}
                                jobStatus={jobStatus}
                            />
                        </Card>

                        <Card
                            title="Applied Candidates"
                            style={{ borderRadius: 16 }}
                        >
                            <CandidateTable
                                candidates={allCandidates}
                                onStageUpdate={handleStageUpdate}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={6}>
                        <Card
                            title="Job Overview"
                            style={{ borderRadius: 16 }}
                            styles={{ body: { padding: 20 } }}
                        >
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Type">{job.jobType}</Descriptions.Item>
                                <Descriptions.Item label="Level">{job.experienceLevel}</Descriptions.Item>
                                <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
                                <Descriptions.Item label="Salary">{job.salaryRange}</Descriptions.Item>
                                <Descriptions.Item label="Deadline">{dayjs(job.applicationDeadline).format('MMM DD')}</Descriptions.Item>
                            </Descriptions>
                            <Divider style={{ margin: '16px 0' }} />
                            <Title level={5} style={{ fontSize: 13 }}>Description</Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>{job.jobDescription}</Text>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Add New Candidate"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddCandidate}>
                        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
                            <Input placeholder="John Doe" />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                        <Form.Item name="experience" label="Experience" rules={[{ required: true, message: 'Please enter experience' }]}>
                            <Input placeholder="e.g. 3 years" />
                        </Form.Item>
                        <Form.Item name="skills" label="Skills (Comma separated)" rules={[{ required: true, message: 'Please enter skills' }]}>
                            <Input placeholder="React, Node.js, AWS" />
                        </Form.Item>
                        <Form.Item name="resumeUrl" label="Resume URL">
                            <Input placeholder="https://..." />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            Add Candidate
                        </Button>
                    </Form>
                </Modal>

                {/* Share Modal */}
                <Modal
                    title="Share Job Post"
                    open={isShareModalVisible}
                    onCancel={() => setIsShareModalVisible(false)}
                    footer={null}
                    centered
                    width={500}
                >
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24, textAlign: 'center' }}>
                        Share this job opening with your network
                    </Text>

                    <Row gutter={[24, 24]} justify="center">
                        {sharePlatforms.map(platform => (
                            <Col key={platform.name} span={6} style={{ textAlign: 'center' }}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handlePlatformClick(platform)}
                                >
                                    <div style={{
                                        width: 50, height: 50, borderRadius: '50%', background: token.colorFillSecondary,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
                                        position: 'relative'
                                    }}>
                                        {sharingPlatform === platform.name ? <Spin size="small" /> : platform.icon}
                                    </div>
                                    <Text style={{ fontSize: 12 }}>{platform.name}</Text>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Modal>

                {/* Edit Job Modal */}
                <Modal
                    title="Edit Job Details"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                    width={700}
                >
                    <Form form={editForm} layout="vertical" onFinish={handleEditJob}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Engineering">Engineering</Option>
                                        <Option value="Design">Design</Option>
                                        <Option value="Product">Product</Option>
                                        <Option value="Marketing">Marketing</Option>
                                        <Option value="HR">HR</Option>
                                        <Option value="Sales">Sales</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="jobType" label="Type" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Full-time">Full-time</Option>
                                        <Option value="Part-time">Part-time</Option>
                                        <Option value="Contract">Contract</Option>
                                        <Option value="Internship">Internship</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="experienceLevel" label="Level" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Junior">Junior</Option>
                                        <Option value="Mid">Mid</Option>
                                        <Option value="Senior">Senior</Option>
                                        <Option value="Lead">Lead</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Onsite">Onsite</Option>
                                        <Option value="Remote">Remote</Option>
                                        <Option value="Hybrid">Hybrid</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="salaryRange" label="Salary Range" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="applicationDeadline" label="Deadline" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="jobDescription" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
                                <Button type="primary" htmlType="submit" loading={editing}>
                                    Save Changes
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>
            </div>
        </PageContainer>
    );
};

export default JobDetails;
