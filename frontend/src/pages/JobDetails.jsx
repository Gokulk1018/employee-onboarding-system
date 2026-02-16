import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Row, Col, Card, Tag, Button, Space, theme,
    Spin, App, Breadcrumb, Divider, Descriptions
} from 'antd';
import {
    ArrowLeftOutlined, EnvironmentOutlined, CalendarOutlined,
    EditOutlined, ShareAltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import RecruitmentKanban from '../components/recruitment/RecruitmentKanban';
import CandidateTable from '../components/recruitment/CandidateTable';
import { getSessionJobs, getSessionCandidates, updateSessionCandidates } from '../data/mockRecruitmentData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const { message } = App.useApp();

    const [job, setJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allJobs = getSessionJobs();
        const foundJob = allJobs.find(j => j._id === id);
        if (foundJob) {
            setJob(foundJob);
            setCandidates(getSessionCandidates(id));
        } else {
            message.error('Job not found');
            navigate('/recruitment');
        }
        setLoading(false);
    }, [id]);

    const handleStageUpdate = (candidateId, newStage) => {
        const updatedCandidates = candidates.map(c =>
            c._id === candidateId ? { ...c, stage: newStage } : c
        );
        setCandidates(updatedCandidates);
        updateSessionCandidates(id, updatedCandidates);
        message.success(`Candidate moved to ${newStage}`);
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
    if (!job) return null;

    const isDeadlinePassed = dayjs().isAfter(dayjs(job.applicationDeadline));
    const jobStatus = isDeadlinePassed ? 'CLOSED' : 'OPEN';

    // Stats configuration
    const statsConfig = [
        { label: 'Total Applied', stage: 'ALL', color: '#1677ff' }, // Total pool
        { label: 'In Screening', stage: 'Screening', color: '#722ed1' }, // purple
        { label: 'In Technical Round', stage: 'Technical Round', color: '#fa8c16' }, // orange
        { label: 'In HR Interview', stage: 'HR Interview', color: '#fadb14' }, // yellow
        { label: 'Selected', stage: 'Selected', color: '#52c41a' }, // green
        { label: 'Rejected', stage: 'Rejected', color: '#f5222d' } // red
    ];

    const activeStats = statsConfig.map(stat => {
        const count = stat.stage === 'ALL'
            ? candidates.length
            : candidates.filter(c => c.stage === stat.stage).length;

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
                        <Button icon={<ShareAltOutlined />} size="small">Share</Button>
                        <Button type="primary" icon={<EditOutlined />} size="small">Edit Job</Button>
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
                                candidates={candidates}
                                onStageUpdate={handleStageUpdate}
                                jobStatus={jobStatus}
                            />
                        </Card>

                        <Card
                            title="Applied Candidates"
                            style={{ borderRadius: 16 }}
                        >
                            <CandidateTable
                                candidates={candidates}
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
            </div>
        </PageContainer>
    );
};

export default JobDetails;
