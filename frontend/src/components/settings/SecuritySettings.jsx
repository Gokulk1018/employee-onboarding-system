import React from 'react';
import { Form, Input, Switch, Select, Card, Button, Typography, Space, theme, message } from 'antd';
import { SaveOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SecuritySettings = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const handleChangePassword = (values) => {
        console.log('Change Password:', values);
        message.success('Password changed successfully');
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    };

    const handleSecuritySettings = (values) => {
        console.log('Security Settings:', values);
        message.success('Security settings saved successfully');
    };

    return (
        <Card bordered={false} className="glass-card">
            <Title level={5} style={{ marginBottom: 24, color: token.colorText }}>
                <LockOutlined /> Change Password
            </Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleChangePassword}
                style={{ marginBottom: 40 }}
            >
                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please enter current password' }]}
                >
                    <Input.Password size="large" placeholder="Enter current password" />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 8, message: 'Password must be at least 8 characters' }
                    ]}
                >
                    <Input.Password size="large" placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm new password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Change Password
                    </Button>
                </Form.Item>
            </Form>

            <Title level={5} style={{ marginBottom: 24, color: token.colorText }}>
                Security Preferences
            </Title>

            <Form
                layout="vertical"
                onFinish={handleSecuritySettings}
                initialValues={{
                    loginAlert: true,
                    sessionTimeout: '30'
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500, color: token.colorText }}>Login Alert</div>
                            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                                Receive email notifications for new login attempts
                            </div>
                        </div>
                        <Form.Item name="loginAlert" valuePropName="checked" style={{ margin: 0 }}>
                            <Switch />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="sessionTimeout"
                        label="Session Timeout"
                        rules={[{ required: true, message: 'Please select session timeout' }]}
                    >
                        <Select size="large" placeholder="Select timeout duration">
                            <Select.Option value="15">15 minutes</Select.Option>
                            <Select.Option value="30">30 minutes</Select.Option>
                            <Select.Option value="60">1 hour</Select.Option>
                            <Select.Option value="120">2 hours</Select.Option>
                            <Select.Option value="240">4 hours</Select.Option>
                        </Select>
                    </Form.Item>
                </Space>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Save Security Settings
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SecuritySettings;
