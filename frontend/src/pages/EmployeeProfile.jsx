import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Typography, Avatar, Descriptions,
    Tag, Button, Space, Form, Input, Divider, theme,
    Upload, App
} from 'antd';
import {
    UserOutlined, MailOutlined, PhoneOutlined,
    EnvironmentOutlined, EditOutlined, SaveOutlined,
    CameraOutlined, AuditOutlined, TeamOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const EmployeeProfile = () => {
    const { token } = theme.useToken();
    const { message: msg } = App.useApp();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:5000/api/employees/${userId}`);
                if (response.data.success) {
                    setEmployee(response.data.data);
                    form.setFieldsValue(response.data.data);
                }
            } catch (error) {
                msg.error('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [form]);

    const handleUpdate = async (values) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.put(`http://localhost:5000/api/employees/${userId}`, values);
            if (response.data.success) {
                setEmployee(response.data.data);
                setIsEditing(false);
                msg.success('Profile updated successfully');
            }
        } catch (error) {
            msg.error('Failed to update profile');
        }
    };

    if (loading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '0px' }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card
                        className="glass-card"
                        style={{ borderRadius: 24, textAlign: 'center' }}
                    >
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                size={160}
                                src={employee?.avatar || `https://ui-avatars.com/api/?name=${employee?.name}&background=random`}
                                icon={<UserOutlined />}
                                style={{ border: `4px solid ${token.colorBgContainer}`, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                            />
                            <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                                <Upload showUploadList={false}>
                                    <Button shape="circle" icon={<CameraOutlined />} size="medium" />
                                </Upload>
                            </div>
                        </div>
                        <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>{employee?.name}</Title>
                        <Text type="secondary">{employee?.role}</Text>
                        <Divider />
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'left' }}>
                            <Space><TeamOutlined /> <Text>{employee?.department}</Text></Space>
                            <Space><MailOutlined /> <Text>{employee?.email}</Text></Space>
                            <Space><CalendarOutlined /> <Text>Joined {dayjs(employee?.joinDate).format('MMM Do, YYYY')}</Text></Space>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card
                        className="glass-card"
                        style={{ borderRadius: 24 }}
                        title={<Title level={4} style={{ margin: 0 }}>Professional Information</Title>}
                        extra={
                            <Button
                                type={isEditing ? 'primary' : 'default'}
                                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                                onClick={() => isEditing ? form.submit() : setIsEditing(true)}
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
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="name" label="Full Name">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="email" label="Email Address">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="department" label="Department">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="role" label="Designation">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Title level={5}>Additional Details</Title>
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="phone" label="Phone Number" initialValue="+1 (555) 000-0000">
                                        <Input prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="location" label="Location" initialValue="Headquarters, NY">
                                        <Input prefix={<EnvironmentOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Card
                        className="glass-card"
                        style={{ borderRadius: 24, marginTop: 24 }}
                        title={<Title level={4} style={{ margin: 0 }}>Skills & Expertise</Title>}
                    >
                        <Space wrap>
                            {['React', 'Node.js', 'System Design', 'Team Leadership', 'UI/UX'].map(tag => (
                                <Tag key={tag} color="blue" style={{ padding: '4px 12px', borderRadius: 8 }}>{tag}</Tag>
                            ))}
                            <Button type="dashed" size="small" icon={<EditOutlined />}>Add Skill</Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default EmployeeProfile;
