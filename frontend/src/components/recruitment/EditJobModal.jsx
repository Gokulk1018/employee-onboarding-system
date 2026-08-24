import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Space, Button, App, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;

const EditJobModal = ({ open, onClose, job, onSuccess }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    useEffect(() => {
        if (job && open) {
            form.setFieldsValue({
                ...job,
                applicationDeadline: job.applicationDeadline ? dayjs(job.applicationDeadline) : null,
                skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills
            });
        }
    }, [job, open, form]);

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                applicationDeadline: values.applicationDeadline.toISOString(),
                skills: typeof values.skills === 'string' ? values.skills.split(',').map(s => s.trim()) : values.skills,
                googleFormUrl: values.googleFormUrl || ''
            };

            const response = await api.put(`/jobs/${job._id}`, payload);

            if (response.data.success) {
                message.success('Job updated successfully');
                onSuccess(response.data.data);
                onClose();
            }
        } catch (error) {
            console.error('Update Job Error:', error);
            message.error(error.response?.data?.message || 'Failed to update job');
        }
    };

    return (
        <Modal
            title="Edit Job Opening"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            width={700}
            centered
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                    <Form.Item
                        name="jobTitle"
                        label="Job Title"
                        rules={[{ required: true, message: 'Please enter job title' }]}
                    >
                        <Input placeholder="e.g. Senior Frontend Developer" />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Department"
                        rules={[{ required: true, message: 'Please enter department' }]}
                    >
                        <Input placeholder="e.g. Developer" />
                    </Form.Item>

                    <Form.Item
                        name="jobType"
                        label="Job Type"
                        rules={[{ required: true, message: 'Please select job type' }]}
                    >
                        <Select placeholder="Select type">
                            <Option value="Full-time">Full-time</Option>
                            <Option value="Part-time">Part-time</Option>
                            <Option value="Internship">Internship</Option>
                            <Option value="Contract">Contract</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="experienceLevel"
                        label="Experience Level"
                        rules={[{ required: true, message: 'Please select level' }]}
                    >
                        <Select placeholder="Select level">
                            <Option value="Fresher">Fresher</Option>
                            <Option value="Junior">Junior</Option>
                            <Option value="Mid">Mid</Option>
                            <Option value="Senior">Senior</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please select location' }]}
                    >
                        <Select placeholder="Select location">
                            <Option value="Onsite">Onsite</Option>
                            <Option value="Remote">Remote</Option>
                            <Option value="Hybrid">Hybrid</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="openings"
                        label="Number of Openings"
                        rules={[{ required: true, message: 'Please enter openings' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="salaryRange"
                        label="Salary Range"
                        rules={[{ required: true, message: 'Please enter salary range' }]}
                    >
                        <Input placeholder="e.g. 50k - 80k USD" />
                    </Form.Item>

                    <Form.Item
                        name="applicationDeadline"
                        label="Application Deadline"
                        rules={[{ required: true, message: 'Please select deadline' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="skills"
                    label="Required Skills (Comma separated)"
                    rules={[{ required: true, message: 'Please enter skills' }]}
                >
                    <Input placeholder="React, Node.js, TypeScript" />
                </Form.Item>

                <Form.Item
                    name="jobDescription"
                    label="Job Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea rows={4} placeholder="Describe the role and responsibilities..." />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Job Status"
                >
                    <Select>
                        <Option value="OPEN">OPEN</Option>
                        <Option value="CLOSED">CLOSED</Option>
                    </Select>
                </Form.Item>

                {/* Google Form URL */}
                <Form.Item
                    name="googleFormUrl"
                    label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <LinkOutlined />
                            Google Form Application Link
                            <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>(optional)</Typography.Text>
                        </span>
                    }
                    rules={[{ type: 'url', message: 'Please enter a valid URL (e.g. https://forms.gle/...)' }]}
                >
                    <Input
                        prefix={<LinkOutlined />}
                        placeholder="https://forms.gle/your-form-link"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditJobModal;
