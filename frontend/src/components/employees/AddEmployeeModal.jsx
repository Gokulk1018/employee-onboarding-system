import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, theme, Button, Row, Col } from 'antd';
import axios from 'axios';

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const { token } = theme.useToken();

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);

            const payload = {
                ...values,
                joinDate: values.joinDate ? values.joinDate.toISOString() : undefined,
                avatar: values.avatar || `https://ui-avatars.com/api/?name=${values.name}&background=random`
            };

            const response = await axios.post('http://localhost:5000/api/employees/create', payload);

            if (response.data.success) {
                message.success('Employee added successfully');
                form.resetFields();
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to add employee';
            message.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={<div style={{ textAlign: 'center', width: '100%', fontSize: '1.5rem' }}>Add New Employee</div>}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitting}
                    onClick={() => form.submit()}
                >
                    Save Employee
                </Button>
            ]}
            centered
            width={600}
            className="glass-modal"
            destroyOnHidden
            styles={{ mask: { backdropFilter: 'blur(8px)' } }}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                initialValues={{ status: 'Active' }}
                style={{ marginTop: 24 }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
                            <Input placeholder="John Doe" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Department" name="department" rules={[{ required: true, message: 'Please select department' }]}>
                            <Select placeholder="Select department">
                                <Select.Option value="Engineering">Engineering</Select.Option>
                                <Select.Option value="Design">Design</Select.Option>
                                <Select.Option value="Product">Product</Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                                <Select.Option value="Marketing">Marketing</Select.Option>
                                <Select.Option value="Operations">Operations</Select.Option>
                                <Select.Option value="Finance">Finance</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please enter role' }]}>
                            <Input placeholder="Software Engineer" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="On Leave">On Leave</Select.Option>
                                <Select.Option value="Inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Join Date" name="joinDate" rules={[{ required: true, message: 'Please select join date' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Avatar URL (Optional)" name="avatar">
                    <Input placeholder="https://i.pravatar.cc/150?u=username" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;
