import React, { useState } from 'react';
import { Form, Input, Upload, Button, Select, Card, theme, message } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const CompanySettings = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const handleSave = (values) => {
        console.log('Company Settings:', values);
        message.success('Company settings saved successfully');
    };

    const timeZones = [
        'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
        'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
        'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
        'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+05:30', 'UTC+06:00',
        'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
    ];

    return (
        <Card bordered={false} className="glass-card">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    companyName: 'HRFlow Inc.',
                    hrEmail: 'hr@hrflow.com',
                    phone: '+1 (555) 123-4567',
                    location: 'New York, NY',
                    timezone: 'UTC-05:00'
                }}
            >
                <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please enter company name' }]}
                >
                    <Input size="large" placeholder="Enter company name" />
                </Form.Item>

                <Form.Item
                    name="logo"
                    label="Company Logo"
                >
                    <Upload
                        maxCount={1}
                        beforeUpload={() => false}
                        listType="picture"
                    >
                        <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="hrEmail"
                    label="HR Email Address"
                    rules={[
                        { required: true, message: 'Please enter HR email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input size="large" placeholder="hr@company.com" type="email" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Company Phone Number"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                    <Input size="large" placeholder="+1 (555) 123-4567" />
                </Form.Item>

                <Form.Item
                    name="location"
                    label="Office Location"
                    rules={[{ required: true, message: 'Please enter office location' }]}
                >
                    <Input size="large" placeholder="City, State/Country" />
                </Form.Item>

                <Form.Item
                    name="timezone"
                    label="Time Zone"
                    rules={[{ required: true, message: 'Please select time zone' }]}
                >
                    <Select size="large" placeholder="Select time zone">
                        {timeZones.map(tz => (
                            <Select.Option key={tz} value={tz}>{tz}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Save Company Settings
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CompanySettings;
