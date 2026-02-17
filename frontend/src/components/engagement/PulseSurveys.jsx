import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Modal, Form, Radio, Checkbox, Input, theme, Spin, Empty, App } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, FormOutlined } from '@ant-design/icons';
import { getSurveys, submitSurveyResponse } from '../../services/engagementService';

const { Title, Text } = Typography;

const PulseSurveys = () => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSurvey, setActiveSurvey] = useState(null);
    const [form] = Form.useForm();

    const fetchSurveys = async () => {
        setLoading(true);
        try {
            const res = await getSurveys();
            if (res.success) {
                setSurveys(res.data);
            }
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const handleOpenSurvey = (survey) => {
        setActiveSurvey(survey);
        setIsModalOpen(true);
    };

    const handleSubmitResponse = async (values) => {
        try {
            const answers = activeSurvey.questions.map(q => ({
                questionText: q.questionText,
                answer: values[q._id]
            }));

            const res = await submitSurveyResponse({
                surveyId: activeSurvey._id,
                answers
            });

            if (res.success) {
                message.success('Response submitted. Thank you!');
                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to submit response');
        }
    };

    return (
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: `1px solid ${token.colorBorder}`, height: '100%' }}>
            <Title level={4} style={{ marginBottom: 24 }}>Active Pulse Surveys</Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin /></div>
            ) : surveys.length > 0 ? (
                <List
                    dataSource={surveys}
                    renderItem={(item) => (
                        <div style={{
                            padding: 16,
                            background: token.colorBgLayout,
                            borderRadius: 12,
                            marginBottom: 16,
                            border: `1px solid ${token.colorBorderSecondary}`
                        }}>
                            <div className="flex-between">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>{item.description}</Text>
                                </div>
                                <Button type="primary" size="small" icon={<FormOutlined />} onClick={() => handleOpenSurvey(item)}>Take Survey</Button>
                            </div>
                        </div>
                    )}
                />
            ) : (
                <Empty description="No active surveys at the moment" />
            )}

            <Modal
                title={activeSurvey?.title}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
                destroyOnHidden
            >
                <Form layout="vertical" form={form} onFinish={handleSubmitResponse}>
                    {activeSurvey?.questions.map((q) => (
                        <Form.Item
                            key={q._id}
                            name={q._id}
                            label={<Text strong>{q.questionText}</Text>}
                            rules={[{ required: true, message: 'Please answer this question' }]}
                        >
                            {q.type === 'Yes/No' ? (
                                <Radio.Group optionType="button" buttonStyle="solid">
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            ) : q.type === 'Multiple Choice' ? (
                                <Radio.Group>
                                    {q.options.map(opt => (
                                        <Radio key={opt} value={opt} style={{ display: 'block', marginBottom: 8 }}>{opt}</Radio>
                                    ))}
                                </Radio.Group>
                            ) : q.type === 'Rating' ? (
                                <Radio.Group>
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            ) : (
                                <Input.TextArea placeholder="Your answer..." />
                            )}
                        </Form.Item>
                    ))}
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button style={{ marginRight: 8 }} onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit Response</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PulseSurveys;
