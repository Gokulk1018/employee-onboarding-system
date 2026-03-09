import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Typography, Avatar, Divider,
    Button, Form, Input, Space, theme, Upload, App,
    Tooltip
} from 'antd';
import {
    UserOutlined, MailOutlined, EditOutlined,
    SaveOutlined, CameraOutlined, LinkOutlined,
    CloudUploadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminProfile = () => {
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/me');
            if (response.data.success) {
                const data = response.data.data;
                setAdminData(data);
                setAvatarUrl(data.avatar || '');
                form.setFieldsValue({
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar || ''
                });

                // Sync with localStorage for header consistency
                localStorage.setItem('name', data.name);
                localStorage.setItem('username', data.name);
                localStorage.setItem('avatar', data.avatar || '');
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            message.error('Failed to fetch admin profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        try {
            setLoading(true);
            const response = await api.put('/auth/profile', values);
            if (response.data.success) {
                setAdminData(response.data.data);
                setIsEditing(false);
                message.success('Profile updated successfully');
                // Update localStorage to reflect changes immediately in header
                localStorage.setItem('name', response.data.data.name);
                localStorage.setItem('username', response.data.data.name); // Keep username for fallback/compatibility
                localStorage.setItem('avatar', response.data.data.avatar);
                window.dispatchEvent(new Event('storage')); // Trigger update in other components
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (info) => {
        const { status, originFileObj } = info.file;
        if (status === 'uploading') {
            return;
        }
        if (status === 'done' || originFileObj) {
            const formData = new FormData();
            formData.append('avatar', originFileObj);
            try {
                setLoading(true);
                const response = await api.post('/auth/upload-avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.success) {
                    const newUrl = response.data.url;
                    setAvatarUrl(newUrl);
                    form.setFieldsValue({ avatar: newUrl });
                    message.success('Avatar uploaded successfully');

                    // Update localStorage and notify other components immediately
                    localStorage.setItem('avatar', newUrl);
                    window.dispatchEvent(new Event('storage'));
                }
            } catch (error) {
                message.error('Avatar upload failed');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <PageContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: 1000, margin: '0 auto' }}
            >
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="glass-button"
                        style={{ border: 'none' }}
                    />
                    <div>
                        <Title level={2} className="text-gradient" style={{ margin: 0 }}>HR Profile</Title>
                        <Text type="secondary">Manage your personal information and profile appearance</Text>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Card
                            className="glass-card"
                            style={{ borderRadius: 24, textAlign: 'center', height: '100%' }}
                        >
                            <div style={{ position: 'relative', display: 'inline-block', padding: 4 }}>
                                <Avatar
                                    size={160}
                                    src={avatarUrl || `https://ui-avatars.com/api/?name=${adminData?.name}&background=random`}
                                    icon={<UserOutlined />}
                                    style={{
                                        border: `4px solid ${token.colorBgContainer}`,
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                        background: token.colorBgContainer
                                    }}
                                />
                                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                                    <Upload
                                        showUploadList={false}
                                        customRequest={({ file, onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                                        onChange={handleFileUpload}
                                    >
                                        <Tooltip title="Upload local image">
                                            <Button
                                                shape="circle"
                                                icon={<CameraOutlined />}
                                                size="large"
                                                className="glass-button"
                                                style={{ border: 'none' }}
                                            />
                                        </Tooltip>
                                    </Upload>
                                </div>
                            </div>
                            <Title level={3} style={{ marginTop: 24, marginBottom: 4 }}>{adminData?.name}</Title>
                            <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>{adminData?.role} Professional</Text>

                            <Divider style={{ margin: '24px 0' }} />

                            <Space direction="vertical" style={{ width: '100%', textAlign: 'left' }} size="middle">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ padding: 8, borderRadius: 10, background: `${token.colorPrimary}15`, color: token.colorPrimary }}>
                                        <MailOutlined />
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Email Address</Text>
                                        <div style={{ fontWeight: 500 }}>{adminData?.email}</div>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card
                            className="glass-card"
                            style={{ borderRadius: 24 }}
                            title={<Title level={4} style={{ margin: 0 }}>Account Information</Title>}
                            extra={
                                <Button
                                    type={isEditing ? 'primary' : 'default'}
                                    icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                                    onClick={() => isEditing ? form.submit() : setIsEditing(true)}
                                    loading={loading}
                                    className={isEditing ? '' : 'glass-button'}
                                >
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </Button>
                            }
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleUpdate}
                                disabled={!isEditing}
                                requiredMark={false}
                            >
                                <Row gutter={24}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="name"
                                            label="Full Name"
                                            rules={[{ required: true, message: 'Please enter your name' }]}
                                        >
                                            <Input placeholder="Enter your full name" prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email Address"
                                            rules={[
                                                { required: true, message: 'Please enter your email' },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                        >
                                            <Input placeholder="Enter your email" prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item
                                            name="avatar"
                                            label="Profile Picture URL"
                                            help="You can provide a direct URL to an image or upload one from your computer."
                                        >
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                prefix={<LinkOutlined style={{ color: token.colorTextTertiary }} />}
                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                suffix={
                                                    <Tooltip title="Import from URL">
                                                        <CloudUploadOutlined style={{ color: token.colorPrimary }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ marginTop: 16 }}
                                    >
                                        <Divider />
                                        <Space>
                                            <Button type="primary" htmlType="submit" loading={loading}>
                                                Update Profile
                                            </Button>
                                            <Button onClick={() => {
                                                setIsEditing(false);
                                                form.setFieldsValue({
                                                    name: adminData.name,
                                                    email: adminData.email,
                                                    avatar: adminData.avatar
                                                });
                                                setAvatarUrl(adminData.avatar || '');
                                            }}>
                                                Cancel
                                            </Button>
                                        </Space>
                                    </motion.div>
                                )}
                            </Form>
                        </Card>

                        <Card
                            className="glass-card"
                            style={{ borderRadius: 24, marginTop: 24 }}
                            title={<Title level={4} style={{ margin: 0 }}>System Role</Title>}
                        >
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <div style={{
                                    padding: '12px 24px',
                                    borderRadius: 16,
                                    background: `${token.colorSuccess}15`,
                                    color: token.colorSuccess,
                                    fontWeight: 600,
                                    border: `1px solid ${token.colorSuccess}30`
                                }}>
                                    Full Access
                                </div>
                                <Text type="secondary">
                                    You have full HR privileges to manage employees, payroll, recruitment, and system settings.
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};

export default AdminProfile;
