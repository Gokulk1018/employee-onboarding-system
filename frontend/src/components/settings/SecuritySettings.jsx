import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, Card, Button, Typography, Space, theme, message as antdMessage, Spin, App } from 'antd';
import { SaveOutlined, LockOutlined } from '@ant-design/icons';
import { getSettings, updateSettings, changePassword } from '../../services/settingsService';

const { Title } = Typography;

const SecuritySettings = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [prefForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await getSettings();
                if (res.success && res.data) {
                    prefForm.setFieldsValue(res.data.security);
                }
            } catch (error) {
                message.error('Failed to load security settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [prefForm]);

    const handleChangePassword = async (values) => {
        try {
            const res = await changePassword({ ...values, userId, userRole });
            if (res.success) {
                message.success('Password changed successfully');
                form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
            } else {
                message.error(res.message || 'Failed to change password');
            }
        } catch (error) {
            message.error('An error occurred');
        }
    };

    const handleSecuritySettingsByFinish = async (values) => {
        try {
            const res = await updateSettings({ security: values });
            if (res.success) {
                message.success('Security settings saved successfully');
            }
        } catch (error) {
            message.error('Failed to save security settings');
        }
    };

    return (
        <Card bordered={false} className="glass-card">
            <Spin spinning={loading}>
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
                    form={prefForm}
                    layout="vertical"
                    onFinish={handleSecuritySettingsByFinish}
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
            </Spin>
        </Card>
    );
};

export default SecuritySettings;
