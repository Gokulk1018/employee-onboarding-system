import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Select, Card, theme, message as antdMessage, Spin, App } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { getSettings, updateSettings, uploadLogo } from '../../services/settingsService';
import { useSettings } from '../../context/SettingsContext';

const CompanySettings = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const { refreshSettings } = useSettings();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await getSettings();
                if (res.success && res.data) {
                    form.setFieldsValue(res.data.companyInfo);
                }
            } catch (error) {
                message.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [form]);

    const timeZones = [
        'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
        'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
        'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
        'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+05:30', 'UTC+06:00',
        'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
    ];

    const handleSave = async (values) => {
        try {
            const { logo, ...companyInfo } = values;

            // Handle Logo Upload if present
            if (logo && logo[0]?.originFileObj) {
                const formData = new FormData();
                formData.append('logo', logo[0].originFileObj);
                const uploadRes = await uploadLogo(formData);
                if (!uploadRes.success) {
                    throw new Error('Logo upload failed');
                }
            }

            const res = await updateSettings({ companyInfo });
            if (res.success) {
                message.success('Company settings saved successfully');
                refreshSettings();
            }
        } catch (error) {
            message.error(error.message || 'Failed to save settings');
        }
    };

    return (
        <Card variant="borderless" className="glass-card">
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
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
                        valuePropName="fileList"
                        getValueFromEvent={e => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList;
                        }}
                    >
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            listType="picture-card"
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
            </Spin>
        </Card>
    );
};

export default CompanySettings;
