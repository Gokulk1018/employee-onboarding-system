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
                    name: editData.name,
                    email: editData.email,
                    phone: editData.phone,
                    role: editData.role,
                    department: editData.department,
                    salary: editData.salary,
                    joiningDate: editData.joiningDate !== 'N/A' ? dayjs(editData.joiningDate) : null
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
                joiningDate: values.joiningDate ? values.joiningDate.toISOString() : null
            };

            if (editData) {
                await axios.put(`http://localhost:5000/api/offers/${editData.id}`, payload);
                message.success('Offer updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/offers/create', payload);
                message.success('Offer sent successfully');
            }

            setLoading(false);
            onSuccess();
            onClose();
        } catch (error) {
            setLoading(false);
            if (error.response) {
                message.error(error.response.data.error || 'Failed to process offer');
            } else if (error.errorFields) {
                // Form validation error, do nothing
            } else {
                message.error('Something went wrong');
            }
        }
    };

    return (
        <Drawer
            title={editData ? "Edit Offer Details" : "Create Offer Letter"}
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
                <Space>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : (editData ? "Update Offer" : "Send Offer")}
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" hideRequiredMark disabled={loading}>
                <Form.Item
                    name="name"
                    label="Candidate Name"
                    rules={[{ required: true, message: 'Please enter candidate name' }]}
                >
                    <Input placeholder="Please enter candidate name" size="large" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Candidate Email"
                    rules={[
                        { required: true, message: 'Please enter candidate email' },
                        { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                >
                    <Input placeholder="candidate@example.com" size="large" type="email" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Candidate Phone"
                    rules={[{ required: true, message: 'Please enter candidate phone' }]}
                >
                    <Input placeholder="+1 (555) 000-0000" size="large" />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                            <Select placeholder="Select department">
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
                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Senior Developer" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="salary" label="Annual Salary" rules={[{ required: true }]}>
                            <Input prefix="$" placeholder="e.g. 120,000" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                {!editData && (
                    <Form.Item name="message" label="Personal Message">
                        <Input.TextArea rows={4} placeholder="Welcome message..." />
                    </Form.Item>
                )}
            </Form>
        </Drawer>
    );
};
export default OfferDrawer;
