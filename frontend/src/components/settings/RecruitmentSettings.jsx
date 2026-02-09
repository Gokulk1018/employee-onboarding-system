import React from 'react';
import { Form, InputNumber, Switch, Card, Button, Tag, Space, Input, theme, message } from 'antd';
import { SaveOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const RecruitmentSettings = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [hiringStages, setHiringStages] = React.useState([
        'Applied', 'Screening', 'Interview', 'Offer', 'Hired'
    ]);
    const [newStage, setNewStage] = React.useState('');

    const handleSave = (values) => {
        console.log('Recruitment Settings:', { ...values, hiringStages });
        message.success('Recruitment settings saved successfully');
    };

    const addStage = () => {
        if (newStage.trim() && !hiringStages.includes(newStage.trim())) {
            setHiringStages([...hiringStages, newStage.trim()]);
            setNewStage('');
        }
    };

    const removeStage = (stage) => {
        setHiringStages(hiringStages.filter(s => s !== stage));
    };

    return (
        <Card bordered={false} className="glass-card">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    offerExpiryDays: 7,
                    interviewReminder: true,
                    autoAssignRecruiter: false
                }}
            >
                <Form.Item label="Default Hiring Stages">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space wrap>
                            {hiringStages.map((stage, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeStage(stage)}
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: 14,
                                        borderRadius: 8
                                    }}
                                >
                                    {stage}
                                </Tag>
                            ))}
                        </Space>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Add new stage"
                                value={newStage}
                                onChange={(e) => setNewStage(e.target.value)}
                                onPressEnter={addStage}
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={addStage}>
                                Add
                            </Button>
                        </Space.Compact>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="offerExpiryDays"
                    label="Offer Expiry Days"
                    rules={[{ required: true, message: 'Please enter offer expiry days' }]}
                >
                    <InputNumber
                        min={1}
                        max={90}
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Number of days"
                    />
                </Form.Item>

                <Form.Item
                    name="interviewReminder"
                    label="Interview Reminder"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="autoAssignRecruiter"
                    label="Auto Assign Recruiter"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Save Recruitment Settings
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RecruitmentSettings;
