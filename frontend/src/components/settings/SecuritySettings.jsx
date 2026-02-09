import React from 'react';
import { Form, Switch, Button, Typography, Input, theme } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SecuritySettings = () => {
    const { token } = theme.useToken();
    return (
        <div className="glass-card" style={{ padding: 24, borderColor: token.colorBorder }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>Security & Login</Title>

            <Form layout="vertical">
                <Form.Item label={<span style={{ color: token.colorText }}>Current Password</span>}>
                    <Input.Password placeholder="Enter current password" style={{ background: token.colorBgLayout, border: `1px solid ${token.colorBorder}` }} />
                </Form.Item>
                <Form.Item label={<span style={{ color: token.colorText }}>New Password</span>}>
                    <Input.Password placeholder="Enter new password" style={{ background: token.colorBgLayout, border: `1px solid ${token.colorBorder}` }} />
                </Form.Item>
                <div style={{ marginBottom: 24 }}>
                    <div className="flex-between" style={{ marginBottom: 12 }}>
                        <div>
                            <Text strong style={{ color: token.colorText }}>Two-Factor Authentication</Text>
                            <div style={{ color: token.colorTextSecondary, fontSize: 13 }}>Add an extra layer of security to your account</div>
                        </div>
                        <Switch />
                    </div>
                </div>
                <Button type="primary" icon={<LockOutlined />}>Update Password</Button>
            </Form>
        </div>
    );
};

export default SecuritySettings;
