import React from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, theme, Row, Col, App } from 'antd';
import dayjs from 'dayjs';

const JobPostingDrawer = ({ open, onClose, onSuccess }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const { message } = App.useApp();

    const handleSubmit = () => {
        form.validateFields()
            .then(async values => {
                setLoading(true);
                // Simulate API call delay
                setTimeout(() => {
                    const newJob = {
                        _id: `job-${Date.now()}`,
                        ...values,
                        applicationDeadline: values.applicationDeadline.toISOString(),
                        appliedCount: 0,
                        status: 'OPEN',
                        skills: values.skills || []
                    };

                    message.success('Job posted successfully (Session only)');
                    form.resetFields();
                    if (onSuccess) onSuccess(newJob);
                    setLoading(false);
                }, 800);
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });
    };

    return (
        <Drawer
            title="Post New Job"
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        Post Job
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" form={form} hideRequiredMark>
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            name="jobTitle"
                            label="Job Title"
                            rules={[{ required: true, message: 'Please enter job title' }]}
                        >
                            <Input placeholder="e.g. Senior Frontend Developer" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="openings"
                            label="Openings"
                            initialValue={1}
                            rules={[{ required: true, message: 'Please enter openings' }]}
                        >
                            <Input type="number" min={1} placeholder="1" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please select department' }]}
                        >
                            <Select placeholder="Select department" size="large">
                                <Select.Option value="Engineering">Engineering</Select.Option>
                                <Select.Option value="Design">Design</Select.Option>
                                <Select.Option value="Product">Product</Select.Option>
                                <Select.Option value="Marketing">Marketing</Select.Option>
                                <Select.Option value="Sales">Sales</Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="jobType"
                            label="Job Type"
                            rules={[{ required: true, message: 'Please select job type' }]}
                        >
                            <Select placeholder="Select job type" size="large">
                                <Select.Option value="Full-time">Full-time</Select.Option>
                                <Select.Option value="Part-time">Part-time</Select.Option>
                                <Select.Option value="Internship">Internship</Select.Option>
                                <Select.Option value="Contract">Contract</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="experienceLevel"
                            label="Experience Level"
                            rules={[{ required: true, message: 'Please select experience level' }]}
                        >
                            <Select placeholder="Select experience" size="large">
                                <Select.Option value="Fresher">Fresher</Select.Option>
                                <Select.Option value="Junior">Junior</Select.Option>
                                <Select.Option value="Mid">Mid</Select.Option>
                                <Select.Option value="Senior">Senior</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please select location' }]}
                        >
                            <Select placeholder="Select location" size="large">
                                <Select.Option value="Onsite">Onsite</Select.Option>
                                <Select.Option value="Remote">Remote</Select.Option>
                                <Select.Option value="Hybrid">Hybrid</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="skills"
                    label="Skills Required"
                    rules={[{ required: true, message: 'Please enter required skills' }]}
                >
                    <Select
                        mode="tags"
                        placeholder="Type and press Enter to add skills"
                        size="large"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="jobDescription"
                    label="Job Description"
                    rules={[{ required: true, message: 'Please enter job description' }]}
                >
                    <Input.TextArea
                        rows={6}
                        placeholder="Describe the role, responsibilities, and requirements..."
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="salaryRange"
                            label="Salary Range"
                            rules={[{ required: true, message: 'Please enter salary range' }]}
                        >
                            <Input prefix="$" placeholder="e.g. 100,000 - 150,000" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="applicationDeadline"
                            label="Application Deadline"
                            rules={[{ required: true, message: 'Please select deadline' }]}
                        >
                            <DatePicker style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default JobPostingDrawer;
