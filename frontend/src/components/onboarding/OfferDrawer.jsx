import React from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, theme, Row, Col } from 'antd';

const OfferDrawer = ({ open, onClose }) => {
    const { token } = theme.useToken();
    return (
        <Drawer
            title="Create Offer Letter"
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onClose}>
                        Send Offer
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" hideRequiredMark>
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
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                            <Select placeholder="Select department">
                                <Select.Option value="Engineering">Engineering</Select.Option>
                                <Select.Option value="Design">Design</Select.Option>
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
                            <Input prefix="$" placeholder="e.g. 120,000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="message" label="Personal Message">
                    <Input.TextArea rows={4} placeholder="Welcome message..." />
                </Form.Item>
            </Form>
        </Drawer>
    );
};
export default OfferDrawer;
