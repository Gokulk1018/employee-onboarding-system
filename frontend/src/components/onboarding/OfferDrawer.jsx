import React, { useEffect } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, theme, Row, Col, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const OfferDrawer = ({ open, onClose, onSuccess, editData }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (open) {
            if (editData) {
                form.setFieldsValue({
                    candidateName: editData.name || editData.candidateName,
                    candidateEmail: editData.email || editData.candidateEmail,
                    candidatePhone: editData.phone || editData.candidatePhone,
                    role: editData.role,
                    department: editData.department,
                    annualSalary: editData.salary || editData.annualSalary,
                    joiningDate: editData.rawJoiningDate ? dayjs(editData.rawJoiningDate) : (editData.joiningDate ? dayjs(editData.joiningDate) : null),
                    personalMessage: editData.message || editData.personalMessage
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const payload = {
                ...values,
                candidateName: values.candidateName,
                joiningDate: values.joiningDate ? values.joiningDate.toISOString() : null,
                name: values.candidateName, // Map for backend compatibility if needed
                email: values.candidateEmail,
                phone: values.candidatePhone,
                salary: values.annualSalary,
                message: values.personalMessage
            };

            if (editData) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/${editData.id || editData._id}`, payload);
                message.success('Offer updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/offers/create`, payload);
                message.success('Offer sent successfully');
            }

            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            setLoading(false);
            console.error('Submit Error:', error);
            message.error(error.response?.data?.message || 'Failed to process offer');
        }
    };

    return (
        <Drawer
            title={editData ? "Edit Offer Details" : "Send New Offer Letter"}
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
                <Space>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', border: 'none' }}
                    >
                        {editData ? "Update Offer" : "Send Offer"}
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" disabled={loading} size="large">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="candidateName"
                            label="Candidate Name"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="John Doe" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="candidateEmail"
                            label="Candidate Email"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="candidatePhone" label="Candidate Phone">
                            <Input placeholder="+1 234 567 890" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                            <Select placeholder="Select department">
                                <Select.Option value="Frontend Developer">Frontend Developer</Select.Option>
                                <Select.Option value="Backend Developer">Backend Developer</Select.Option>
                                <Select.Option value="Fullstack Developer">Fullstack Developer</Select.Option>
                                <Select.Option value="Tester">Tester</Select.Option>
                                <Select.Option value="DevOps">DevOps</Select.Option>
                                <Select.Option value="UI/UX">UI/UX</Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Senior Backend Engineer" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="annualSalary" label="Annual Salary ($)" rules={[{ required: true }]}>
                            <Input type="number" placeholder="120000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="personalMessage" label="Personal Message">
                    <Input.TextArea rows={4} placeholder="Anything you want to say to the candidate..." />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default OfferDrawer;