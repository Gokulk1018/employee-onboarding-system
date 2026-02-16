import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Tag, Divider, App, Spin, Result, theme, Row, Col, Select } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, FileTextOutlined, CodeOutlined, RocketOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
                const data = await response.json();
                if (data.success) {
                    setJob(data.data);
                }
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            const data = await response.json();
            if (data.success) {
                setSubmitted(true);
                message.success('Application submitted successfully!');
            } else {
                message.error(data.message || 'Submission failed');
            }
        } catch (error) {
            message.error('Connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: token.colorBgLayout }}><Spin size="large" /></div>;

    if (!job) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: token.colorBgLayout }}>
            <Result status="404" title="Job Not Found" subTitle="The job posting you are looking for does not exist or has been closed." extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>} />
        </div>
    );

    if (submitted) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: token.colorBgLayout, padding: 20 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Card className="glass-card" style={{ maxWidth: 600, textAlign: 'center', padding: '40px 20px', borderRadius: 24 }}>
                    <Result
                        status="success"
                        title="Application Submitted!"
                        subTitle={`Thank you for applying to the ${job.jobTitle} position. Our HR team will review your application and get back to you soon.`}
                        extra={[
                            <Button type="primary" key="home" onClick={() => navigate('/')} size="large" style={{ borderRadius: 12 }}>Return Home</Button>
                        ]}
                    />
                </Card>
            </motion.div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: token.colorBgLayout, padding: '40px 20px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={10}>
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <Title level={4} style={{ textTransform: 'uppercase', fontSize: 14, color: token.colorPrimary, letterSpacing: 1.5 }}>Join Our Team</Title>
                            <Title style={{ marginTop: 8, fontSize: 32 }}>{job.jobTitle}</Title>

                            <Space direction="vertical" size={16} style={{ marginTop: 24, width: '100%' }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Tag color="blue" bordered={false} style={{ padding: '4px 12px', fontSize: 13, borderRadius: 8 }}>{job.department}</Tag>
                                    <Tag color="orange" bordered={false} style={{ padding: '4px 12px', fontSize: 13, borderRadius: 8 }}>{job.jobType}</Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: 15, lineHeight: 1.6 }}>{job.jobDescription}</Text>

                                <Divider style={{ margin: '16px 0' }} />

                                <Title level={5}>Required Skills</Title>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {job.skills.map(skill => (
                                        <Tag key={skill} bordered={false} style={{ borderRadius: 6 }}>{skill}</Tag>
                                    ))}
                                </div>
                            </Space>
                        </motion.div>
                    </Col>

                    <Col xs={24} md={14}>
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <Card className="glass-card" style={{ borderRadius: 24, padding: 12 }}>
                                <Title level={3} style={{ marginBottom: 24 }}>Personal Details</Title>
                                <Form form={form} layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                                                <Input prefix={<UserOutlined style={{ opacity: 0.5 }} />} placeholder="Enter your full name" style={{ borderRadius: 10 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                                                <Input prefix={<MailOutlined style={{ opacity: 0.5 }} />} placeholder="your@email.com" style={{ borderRadius: 10 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}>
                                                <Input prefix={<PhoneOutlined style={{ opacity: 0.5 }} />} placeholder="+1 (555) 000-0000" style={{ borderRadius: 10 }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item name="resumeUrl" label="Resume URL" rules={[{ required: true, message: 'Please provide resume link' }]}>
                                        <Input prefix={<FileTextOutlined style={{ opacity: 0.5 }} />} placeholder="Link to your PDF (Google Drive, Dropbox, etc.)" style={{ borderRadius: 10 }} />
                                    </Form.Item>

                                    <Form.Item name="experience" label="Years of Experience" rules={[{ required: true, message: 'Please provide experience' }]}>
                                        <Input prefix={<RocketOutlined style={{ opacity: 0.5 }} />} placeholder="e.g. 5+ years" style={{ borderRadius: 10 }} />
                                    </Form.Item>

                                    <Form.Item name="skills" label="Key Skills (comma separated)">
                                        <Select
                                            mode="tags"
                                            prefix={<CodeOutlined style={{ opacity: 0.5 }} />}
                                            placeholder="Add your top skills"
                                            style={{ borderRadius: 10 }}
                                        />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ height: 50, borderRadius: 12, marginTop: 12, fontSize: 16, fontWeight: 600 }}>
                                        Submit Application
                                    </Button>
                                    <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}>
                                        By submitting, you agree to our privacy policy and terms of service.
                                    </Paragraph>
                                </Form>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ApplyJob;
