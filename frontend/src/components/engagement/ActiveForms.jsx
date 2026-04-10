import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    const selectedSentiment = Form.useWatch('selectedOption', form);

    const fetchActiveForms = async () => {
        try {
            setLoading(true);
            const res = await getForms();
            if (res.success) {
                setForms(res.data);
            }
        } catch (error) {
            message.error('Failed to load assigned forms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveForms();
    }, []);

    // Effect to handle deep-linking when query params change or forms load
    const { search } = useLocation();
    useEffect(() => {
        if (forms.length > 0) {
            const urlParams = new URLSearchParams(search);
            const formId = urlParams.get('formId');
            if (formId) {
                const targetForm = forms.find(f => f._id === formId);
                if (targetForm) {
                    setSelectedForm(targetForm);
                    setIsRespondModalVisible(true);
                    // Use timeout to ensure form is connected
                    setTimeout(() => form.resetFields(), 0);
                }
            }
        }
    }, [forms, search, form]);

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
                <Space direction="vertical" size={2}>
                    <Space>
                        <StarOutlined style={{ color: token.colorWarning }} />
                        <Title level={4} style={{ margin: 0 }}>Active Engagement Tasks</Title>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>Participate in ongoing forms and surveys</Text>
                </Space>
            }
            style={{ borderRadius: 24 }}
        >
            <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 8, margin: '-8px -8px -8px 0' }} className="custom-scrollbar">
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
                                padding: '16px',
                                background: `${token.colorBgContainer}50`,
                                borderRadius: 16,
                                border: `1px solid ${token.colorBorderSecondary}`,
                                marginBottom: 12,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }} className="active-form-item">
                                <Space size="middle">
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: item.formType === 'survey' ? 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}>
                                        <FileTextOutlined style={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <Title level={5} style={{ margin: 0, fontSize: 14 }}>{item.title}</Title>
                                        <div style={{ marginTop: 2 }}>
                                            <Tag color={item.formType === 'survey' ? 'blue' : 'magenta'} style={{ borderRadius: 4, fontSize: 9, fontWeight: 700, padding: '0 4px' }}>
                                                {item.formType.toUpperCase()}
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: 10 }}>• {item.category}</Text>
                                        </div>
                                    </div>
                                </Space>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size="small"
                                    onClick={() => handleOpenResponse(item)}
                                    icon={<SendOutlined />}
                                    style={{ height: 32, padding: '0 16px', fontSize: 12 }}
                                >
                                    Start
                                </Button>
                            </div>
                        </motion.div>
                    )}
                />
            </div>

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
                    <Form.Item
                        name="selectedOption"
                        label={<Text strong>How are you feeling about this?</Text>}
                        rules={[{ required: true, message: 'Please select an option' }]}
                    >
                        <Radio.Group style={{ width: '100%' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                {[
                                    { label: 'Good', value: 'Good', color: '#52c41a' },
                                    { label: 'Neutral', value: 'Neutral', color: '#faad14' },
                                    { label: 'Bad', value: 'Bad', color: '#ff4d4f' }
                                ].map(opt => (
                                    <Radio.Button
                                        key={opt.value}
                                        value={opt.value}
                                        style={{
                                            height: 'auto',
                                            padding: '16px 8px',
                                            textAlign: 'center',
                                            borderRadius: 12,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: selectedSentiment === opt.value ? 2 : 1,
                                            borderColor: selectedSentiment === opt.value ? opt.color : token.colorBorder
                                        }}
                                    >
                                        <div style={{ fontSize: 16, fontWeight: 600 }}>{opt.label}</div>
                                    </Radio.Button>
                                ))}
                            </div>
                        </Radio.Group>
                    </Form.Item>


                    {(selectedForm?.formType === 'feedback' || selectedSentiment === 'Bad') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <Form.Item
                                name="message"
                                label={<Text strong>{selectedSentiment === 'Bad' ? "What went wrong? Please share your remarks" : "Please provide your detailed feedback"}</Text>}
                                rules={[{ required: true, message: 'Please provide some remarks' }]}
                            >
                                <Input.TextArea
                                    rows={5}
                                    placeholder={selectedSentiment === 'Bad' ? "e.g. Issues with tools, team communication..." : "Type your thoughts here..."}
                                    style={{ borderRadius: 12 }}
                                />
                            </Form.Item>
                        </motion.div>
                    )}
                </Form>
            </Modal>
        </Card>
    );
};

export default ActiveForms;
