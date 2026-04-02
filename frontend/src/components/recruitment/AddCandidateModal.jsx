import React from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Space } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const AddCandidateModal = ({ open, onClose, jobId, onSuccess }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                skills: typeof values.skills === 'string' ? values.skills.split(',').map(s => s.trim()) : []
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/jobs/${jobId}/apply`, payload);

            if (response.data.success) {
                message.success('Candidate added successfully');
                onSuccess(response.data.data);
                form.resetFields();
            }
        } catch (error) {
            console.error('Add Candidate Error:', error);
            message.error(error.response?.data?.message || 'Failed to add candidate');
        }
    };

    return (
        <Modal
            title="Add New Candidate"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={false}
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input placeholder="john@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter phone' }]}
                    >
                        <Input placeholder="+1 234 567 890" />
                    </Form.Item>

                    <Form.Item
                        name="experience"
                        label="Years of Experience"
                        rules={[{ required: true, message: 'Please enter experience' }]}
                    >
                        <Input placeholder="e.g. 5 yrs" />
                    </Form.Item>
                </div>

                <Form.Item
                    name="skills"
                    label="Skills (Comma separated)"
                    rules={[{ required: true, message: 'Please enter skills' }]}
                >
                    <Input placeholder="React, Node.js, TypeScript" />
                </Form.Item>

                <Form.Item
                    name="resumeUrl"
                    label="Resume Link"
                    rules={[{ required: true, message: 'Please enter resume link' }]}
                >
                    <Input placeholder="https://drive.google.com/..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCandidateModal;
