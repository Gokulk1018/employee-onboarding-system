import React from 'react';
import { Typography, Form, Switch, Select, Button, Card, Divider } from 'antd';
import { motion } from 'framer-motion';

const Settings = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography.Title level={2}>Settings</Typography.Title>
            <Card bordered={false} style={{ borderRadius: 16, maxWidth: 800 }}>
                <Typography.Title level={4}>Notifications</Typography.Title>
                <Form layout="horizontal">
                    <Form.Item label="Email Notifications">
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="Push Notifications">
                        <Switch defaultChecked />
                    </Form.Item>
                    <Divider />
                    <Typography.Title level={4}>Appearance</Typography.Title>
                    <Form.Item label="Theme">
                        <Select defaultValue="light">
                            <Select.Option value="light">Light</Select.Option>
                            <Select.Option value="dark">Dark</Select.Option>
                            <Select.Option value="system">System</Select.Option>
                        </Select>
                    </Form.Item>
                    <Divider />
                    <Button type="primary">Save Changes</Button>
                </Form>
            </Card>
        </motion.div>
    );
};
export default Settings;
