import React, { useState } from 'react';
import {
    Form, Input, Button, Card, Steps, Upload,
    message, Typography, Layout, Result
} from 'antd';
import {
    UserOutlined, MailOutlined, PhoneOutlined,
    HomeOutlined, UploadOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const OnboardingForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            // In a real app, we'd upload files to S3/Cloudinary first
            // For now, we simulate data submission
            const response = await axios.post(`http://localhost:5000/api/onboarding/submit`, {
                userId,
                personalData: values,
                documents: [
                    { name: 'Identity Proof', url: 'https://placeholder.com/id.pdf' },
                    { name: 'Educational Certificate', url: 'https://placeholder.com/cert.pdf' }
                ]
            });

            if (response.data.success) {
                setIsSubmitted(true);
                message.success('Onboarding data submitted successfully!');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Personal Info',
            content: (
                <div style={{ marginTop: 24 }}>
                    <Form.Item name="fullName" rules={[{ required: true }]} label="Full Name">
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]} label="Email">
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="phone" rules={[{ required: true }]} label="Phone Number">
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Address',
            content: (
                <div style={{ marginTop: 24 }}>
                    <Form.Item name="address" rules={[{ required: true }]} label="Permanent Address">
                        <Input.TextArea prefix={<HomeOutlined />} rows={4} />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Documents',
            content: (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Upload listType="picture" multiple>
                        <Button icon={<UploadOutlined />}>Click to Upload (ID, Certificates)</Button>
                    </Upload>
                    <div style={{ marginTop: 20 }}>
                        <Text type="secondary">Supported formats: PDF, JPG, PNG (Max 5MB)</Text>
                    </div>
                </div>
            )
        }
    ];

    if (isSubmitted) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
                <Card style={{ maxWidth: 600, borderRadius: 20, textAlign: 'center' }}>
                    <Result
                        status="success"
                        title="Submission Successful!"
                        subTitle="Your onboarding information has been sent to HR for review. You will receive an email once your account is fully activated."
                        extra={[
                            <Button type="primary" key="logout" onClick={() => {
                                localStorage.clear();
                                navigate('/login');
                            }}>
                                Logout
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ width: '100%', maxWidth: 800 }}
                >
                    <Card style={{ borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <Title level={2}>Onboarding Profile</Title>
                            <Text type="secondary">Please complete your details to join the team</Text>
                        </div>

                        <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            style={{ minHeight: 300 }}
                        >
                            {steps[currentStep].content}
                        </Form>

                        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
                            {currentStep > 0 && (
                                <Button onClick={() => setCurrentStep(prev => prev - 1)}>
                                    Previous
                                </Button>
                            )}
                            <div style={{ flex: 1 }} />
                            {currentStep < steps.length - 1 ? (
                                <Button type="primary" onClick={() => setCurrentStep(prev => prev + 1)}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="primary" loading={loading} onClick={() => form.submit()}>
                                    Submit Profile
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </Content>
        </Layout>
    );
};

export default OnboardingForm;
