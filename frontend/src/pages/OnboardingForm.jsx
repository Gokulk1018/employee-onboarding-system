import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Card, Steps, Upload,
    Typography, Layout, Result, theme, Spin, Divider, App, Alert
} from 'antd';
import {
    UserOutlined, MailOutlined, PhoneOutlined,
    HomeOutlined, UploadOutlined, CheckOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const OnboardingForm = () => {
    const { message: msg } = App.useApp();
    const { token } = theme.useToken();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [userData, setUserData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Fetch existing data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/onboarding/user/${userId}`);
                if (response.data.success) {
                    const user = response.data.data;
                    setUserData(user);

                    // Pre-fill form with robust fallback (Map data + Top-level fields)
                    const formValues = {
                        ...(user.onboardingData || {}),
                        fullName: user.candidateName || user.onboardingData?.fullName,
                        email: user.candidateEmail || user.onboardingData?.email,
                        phone: user.candidatePhone || user.onboardingData?.phone,
                        address: user.candidateAddress || user.onboardingData?.address
                    };
                    form.setFieldsValue(formValues);

                    // Pre-fill documents if they exist
                    if (user.documents && user.documents.length > 0) {
                        setFileList(user.documents.map((doc, index) => ({
                            uid: doc._id || index,
                            name: doc.name,
                            status: 'done',
                            url: doc.url,
                        })));
                    }

                    // If already submitted and not approved, it will be handled by the blocking logic below
                    if (user.status === 'submitted' || user.status === 'approved') {
                        setIsSubmitted(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
                msg.error("Failed to load your profile.");
            } finally {
                setFetching(false);
            }
        };

        fetchUserData();
    }, [navigate, form, msg]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');

            // Transform fileList to document objects (Simulating upload)
            const documents = fileList.map(file => ({
                name: file.name,
                url: file.url || `https://placeholder.com/${encodeURIComponent(file.name)}`, // Simulate URL if new
                status: 'pending',
                uploadedAt: new Date()
            }));

            const response = await axios.post(`http://localhost:5000/api/onboarding/submit`, {
                userId,
                personalData: values,
                documents: documents
            });

            if (response.data.success) {
                // Update local status immediately to trigger UI change
                setUserData(prev => ({ ...prev, status: 'submitted' }));
                setIsSubmitted(true);
                msg.success('Onboarding data submitted successfully!');
            }
        } catch (error) {
            msg.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload/removal
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Dummy request for Upload component to prevent auto-uploading
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const steps = [
        {
            title: 'Personal Info',
            content: (
                <div style={{ marginTop: 24 }}>
                    <Form.Item name="fullName" rules={[{ required: true, message: 'Full Name is required' }]} label="Full Name">
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid Email is required' }]} label="Email">
                        <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>
                    <Form.Item name="phone" rules={[{ required: true, message: 'Phone Number is required' }]} label="Phone Number">
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Address',
            content: (
                <div style={{ marginTop: 24 }}>
                    <Form.Item name="address" rules={[{ required: true, message: 'Address is required' }]} label="Permanent Address">
                        <Input.TextArea prefix={<HomeOutlined />} rows={4} />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Documents',
            content: (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <div style={{ marginBottom: 16, textAlign: 'left' }}>
                        <Text strong>Upload required documents (ID Proof, Certificates, etc.)</Text>
                    </div>
                    <Upload
                        customRequest={dummyRequest}
                        fileList={fileList}
                        onChange={handleUploadChange}
                        listType="picture"
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <div style={{ marginTop: 20 }}>
                        <Text type="secondary">Supported formats: PDF, JPG, PNG (Max 5MB)</Text>
                    </div>
                </div>
            )
        }
    ];

    if (fetching) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Success State (After Submission)
    if (isSubmitted && userData?.status !== 'reupload_required') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
                <Card variant="borderless" style={{ width: '100%', maxWidth: 450, borderRadius: 20, textAlign: 'center', padding: '40px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            background: '#10B981', // Emerald 500
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                        }}>
                            <CheckOutlined style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }} />
                        </div>
                    </div>
                    <Title level={3} style={{ margin: '0 0 8px 0', fontSize: 22, fontWeight: 600, color: '#1F2937' }}>Upload Successfully</Title>
                    <Text type="secondary" style={{ fontSize: 14, color: '#6B7280', display: 'block', marginBottom: 32, padding: '0 20px' }}>
                        Your data has been sent. Please wait for HR verification.
                    </Text>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                        style={{
                            background: '#4F46E5', // Indigo 600
                            borderColor: '#4F46E5',
                            width: 140,
                            height: 40,
                            fontSize: 14,
                            borderRadius: 8,
                            fontWeight: 500,
                            boxShadow: 'none'
                        }}
                    >
                        Logout
                    </Button>
                </Card>
            </div>
        );
    }

    // Block re-submission if status is submitted (and not reupload_required)
    if (userData?.status === 'submitted') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                    <Button type="default" danger onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}>
                        Logout
                    </Button>
                </div>
                <Card variant="borderless" style={{ maxWidth: 600, borderRadius: 20, textAlign: 'center', padding: 40 }}>
                    <Result
                        status="info"
                        title="Application Under Review"
                        subTitle="Your data has been sent. Please wait for HR verification."
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
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
                <Button type="default" danger onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                }}>
                    Logout
                </Button>
            </div>

            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ width: '100%', maxWidth: 800 }}
                >
                    <Card variant="borderless" style={{ borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <Title level={2}>Onboarding Profile</Title>
                            <Text type="secondary">Please complete your details to join the team</Text>
                        </div>

                        {userData?.status === 'reupload_required' && (
                            <Alert
                                message="Action Required"
                                description="Some of your documents or details were rejected. Please update them and resubmit."
                                type="warning"
                                showIcon
                                style={{ marginBottom: 24 }}
                            />
                        )}

                        <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            preserve={true}
                            style={{ minHeight: 300 }}
                            initialValues={{
                                email: userData?.candidateEmail
                            }}
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
                                <Button type="primary" onClick={() => {
                                    form.validateFields(['fullName', 'email', 'phone', 'address'].filter(field => {
                                        if (currentStep === 0) return ['fullName', 'email', 'phone'].includes(field);
                                        if (currentStep === 1) return ['address'].includes(field);
                                        return false;
                                    })).then(() => {
                                        setCurrentStep(prev => prev + 1);
                                    }).catch(() => { });
                                }}>
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
