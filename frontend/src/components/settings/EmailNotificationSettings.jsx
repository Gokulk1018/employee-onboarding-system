import React from 'react';
import { Form, Input, Switch, Card, Button, Typography, Space, Divider, theme, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const EmailNotificationSettings = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const handleSave = (values) => {
        console.log('Email & Notification Settings:', values);
        message.success('Email settings saved successfully');
    };

    return (
        <Card bordered={false} className="glass-card">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    senderEmail: 'noreply@hrflow.com',
                    offerLetterTemplate: 'Dear {candidate_name},\n\nWe are pleased to offer you the position of {role} at {company_name}.\n\nSalary: {salary}\nStart Date: {start_date}\n\nBest regards,\nHR Team',
                    welcomeEmailTemplate: 'Welcome to {company_name}, {employee_name}!\n\nWe are excited to have you join our team.\n\nYour first day is {start_date}.\n\nBest regards,\nHR Team',
                    notifyOfferSent: true,
                    notifyOfferAccepted: true,
                    notifyDocumentUploaded: false
                }}
            >
                <Form.Item
                    name="senderEmail"
                    label="Sender Email"
                    rules={[
                        { required: true, message: 'Please enter sender email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input size="large" placeholder="noreply@company.com" type="email" />
                </Form.Item>

                <Form.Item
                    name="offerLetterTemplate"
                    label="Offer Letter Email Template"
                    rules={[{ required: true, message: 'Please enter offer letter template' }]}
                >
                    <TextArea
                        rows={6}
                        placeholder="Use {candidate_name}, {role}, {company_name}, {salary}, {start_date} as placeholders"
                    />
                </Form.Item>

                <Form.Item
                    name="welcomeEmailTemplate"
                    label="Welcome Email Template"
                    rules={[{ required: true, message: 'Please enter welcome email template' }]}
                >
                    <TextArea
                        rows={6}
                        placeholder="Use {employee_name}, {company_name}, {start_date} as placeholders"
                    />
                </Form.Item>

                <Divider />

                <Title level={5} style={{ marginBottom: 16, color: token.colorText }}>
                    Notification Toggles
                </Title>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Offer Sent</Text>
                        <Form.Item name="notifyOfferSent" valuePropName="checked" style={{ margin: 0 }}>
                            <Switch />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Offer Accepted</Text>
                        <Form.Item name="notifyOfferAccepted" valuePropName="checked" style={{ margin: 0 }}>
                            <Switch />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Document Uploaded</Text>
                        <Form.Item name="notifyDocumentUploaded" valuePropName="checked" style={{ margin: 0 }}>
                            <Switch />
                        </Form.Item>
                    </div>
                </Space>

                <Divider />

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Save Email Settings
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EmailNotificationSettings;
