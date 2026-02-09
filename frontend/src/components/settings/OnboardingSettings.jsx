import React from 'react';
import { Form, Checkbox, Select, Switch, Card, Button, theme, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const OnboardingSettings = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const handleSave = (values) => {
        console.log('Onboarding Settings:', values);
        message.success('Onboarding settings saved successfully');
    };

    const documentOptions = [
        { label: 'ID Proof', value: 'idProof' },
        { label: 'Address Proof', value: 'addressProof' },
        { label: 'Educational Certificates', value: 'education' },
        { label: 'Previous Employment Letter', value: 'employment' },
        { label: 'Bank Account Details', value: 'bank' },
        { label: 'Tax Forms', value: 'tax' },
        { label: 'Background Verification', value: 'background' },
    ];

    const joiningDayOptions = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
    ];

    return (
        <Card bordered={false} className="glass-card">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    mandatoryDocuments: ['idProof', 'addressProof', 'education', 'bank'],
                    defaultJoiningDay: 'Monday',
                    orientationRequired: true,
                    itSetupRequired: true
                }}
            >
                <Form.Item
                    name="mandatoryDocuments"
                    label="Mandatory Documents List"
                >
                    <Checkbox.Group
                        options={documentOptions}
                        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                    />
                </Form.Item>

                <Form.Item
                    name="defaultJoiningDay"
                    label="Default Joining Day"
                    rules={[{ required: true, message: 'Please select default joining day' }]}
                >
                    <Select size="large" placeholder="Select day">
                        {joiningDayOptions.map(day => (
                            <Select.Option key={day} value={day}>{day}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="orientationRequired"
                    label="Orientation Required"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="itSetupRequired"
                    label="IT Setup Required"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Save Onboarding Settings
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default OnboardingSettings;
