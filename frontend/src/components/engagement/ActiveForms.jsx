import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Modal, Form, Radio, Input, theme, Space, Tag, Avatar, App } from 'antd';
import { FileTextOutlined, SendOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getForms, submitResponse } from '../../services/engagementService';

const { Title, Text } = Typography;

const ActiveForms = () => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState(null);
    const [isRespondModalVisible, setIsRespondModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchActiveFormsAndCheckQuery = async () => {
            try {
                setLoading(true);
                const res = await getForms();
                if (res.success) {
                    setForms(res.data);

                    // Check for formId in URL to auto-open
                    const urlParams = new URLSearchParams(window.location.search);
                    const formId = urlParams.get('formId');
                    if (formId) {
                        const targetForm = res.data.find(f => f._id === formId);
                        if (targetForm) {
                            handleOpenResponse(targetForm);
                        }
                    }
                }
            } catch (error) {
                message.error('Failed to load assigned forms');
            } finally {
                setLoading(false);
            }
        };

        fetchActiveFormsAndCheckQuery();
    }, []);

    const handleOpenResponse = (f) => {
        setSelectedForm(f);
        setIsRespondModalVisible(true);
    };

    const handleRespond = async (values) => {
        try {
            const res = await submitResponse({
                formId: selectedForm._id,
                ...values
            });
            if (res.success) {
                message.success('Response submitted successfully');
                setIsRespondModalVisible(false);
                form.resetFields();
                fetchActiveForms();
            }
        } catch (error) {
            message.error('Failed to submit response');
        }
    };

    return (
        <Card
            className="glass-card"
            title={
                <Space>
                    <StarOutlined style={{ color: token.colorWarning }} />
                    <Title level={4} style={{ margin: 0 }}>Active Engagement Tasks</Title>
                </Space>
            }
            subTitle="Participate in ongoing forms and surveys"
            style={{ borderRadius: 24 }}
        >
            <List
                loading={loading}
                dataSource={forms}
                locale={{ emptyText: <div style={{ padding: 40 }}><Text type="secondary">All caught up! No pending forms.</Text></div> }}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div style={{
                            padding: '20px',
                            background: `${token.colorBgContainer}50`,
                            borderRadius: 16,
                            border: `1px solid ${token.colorBorderSecondary}`,
                            marginBottom: 16,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }} className="active-form-item">
                            <Space size="large">
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: item.formType === 'survey' ? 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <FileTextOutlined style={{ fontSize: 24 }} />
                                </div>
                                <div>
                                    <Title level={5} style={{ margin: 0 }}>{item.title}</Title>
                                    <Text type="secondary" style={{ fontSize: 13 }}>{item.description}</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag color={item.formType === 'survey' ? 'blue' : 'magenta'} style={{ borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                            {item.formType.toUpperCase()}
                                        </Tag>
                                        <Text type="secondary" style={{ fontSize: 11 }}>• {item.category}</Text>
                                    </div>
                                </div>
                            </Space>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                onClick={() => handleOpenResponse(item)}
                                icon={<SendOutlined />}
                                style={{ height: 44, padding: '0 24px' }}
                            >
                                Start
                            </Button>
                        </div>
                    </motion.div>
                )}
            />

            <Modal
                title={
                    <Space>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: token.colorPrimary }} />
                        <span>{selectedForm?.title}</span>
                    </Space>
                }
                open={isRespondModalVisible}
                onCancel={() => setIsRespondModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnHidden
                centered
                className="glass-modal"
                styles={{ body: { paddingTop: 20 } }}
            >
                <Form form={form} layout="vertical" onFinish={handleRespond}>
                    {selectedForm?.formType === 'survey' && (
                        <Form.Item
                            name="selectedOption"
                            label={<Text strong>How was your experience?</Text>}
                            rules={[{ required: true, message: 'Please select an option' }]}
                        >
                            <Radio.Group style={{ width: '100%' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {['Good', 'Not Bad', 'Worst', 'Need Improvement'].map(opt => (
                                        <Radio.Button
                                            key={opt}
                                            value={opt}
                                            style={{
                                                height: 'auto',
                                                padding: '12px',
                                                textAlign: 'center',
                                                borderRadius: 12,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {opt}
                                        </Radio.Button>
                                    ))}
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    )}
                    <Form.Item
                        name="message"
                        label={<Text strong>{selectedForm?.formType === 'survey' ? "Additional Comments (Optional)" : "Please provide your detailed feedback"}</Text>}
                        rules={[{ required: selectedForm?.formType === 'feedback', message: 'Message is required for feedback' }]}
                    >
                        <Input.TextArea rows={5} placeholder="Type your thoughts here..." style={{ borderRadius: 12 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ActiveForms;
