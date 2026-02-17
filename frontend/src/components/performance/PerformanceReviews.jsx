import React, { useState, useEffect } from 'react';
import { Steps, Typography, theme, Button, Tag, Avatar, List, Modal, Form, Rate, Input, message, Skeleton } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, LoadingOutlined, StarFilled } from '@ant-design/icons';
import { getPendingReviews, submitReview } from '../../services/performanceService';

const { Title, Text } = Typography;

const PerformanceReviews = () => {
    const { token } = theme.useToken();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [form] = Form.useForm();

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await getPendingReviews();
            if (res.success) {
                setPending(res.data);
            }
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleStartReview = (review) => {
        setSelectedReview(review);
        setIsModalVisible(true);
    };

    const handleSubmitReview = async (values) => {
        try {
            const res = await submitReview({
                employeeId: selectedReview.employeeId._id,
                reviewPeriod: selectedReview.reviewPeriod,
                ratings: values.ratings,
                remarks: values.remarks,
                status: 'Completed' // or the next stage in workflow
            });

            if (res.success) {
                message.success('Review submitted successfully');
                setIsModalVisible(false);
                form.resetFields();
                fetchPending();
            }
        } catch (error) {
            message.error('Failed to submit review');
        }
    };

    const ratingFields = [
        { name: 'communication', label: 'Communication' },
        { name: 'technical', label: 'Technical Skills' },
        { name: 'leadership', label: 'Leadership' },
        { name: 'teamwork', label: 'Teamwork' },
        { name: 'punctuality', label: 'Punctuality' },
        { name: 'problemSolving', label: 'Problem Solving' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Review Workflow</Title>
                <Tag color="processing">Active Cycle</Tag>
            </div>

            <Steps
                direction="horizontal"
                size="small"
                current={1}
                style={{ marginBottom: 32 }}
                items={[
                    { title: 'Self' },
                    { title: 'Peer' },
                    { title: 'Manager' },
                    { title: 'Final' },
                ]}
            />

            <div style={{ marginTop: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 16 }}>Pending Actions</Text>

                {loading ? (
                    <Skeleton active avatar />
                ) : (
                    <List
                        dataSource={pending}
                        locale={{ emptyText: 'No pending reviews for you. Good job!' }}
                        renderItem={(item) => (
                            <div className="flex-between" style={{
                                padding: 16,
                                background: token.colorBgContainer,
                                borderRadius: 12,
                                border: `1px solid ${token.colorBorderSecondary}`,
                                marginBottom: 12,
                                transition: 'all 0.3s'
                            }}>
                                <div className="flex-center" style={{ gap: 12 }}>
                                    <Avatar src={item.employeeId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.employeeId?.name}`} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: token.colorText }}>{item.employeeId?.name}</div>
                                        <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{item.status} • {item.reviewPeriod}</div>
                                    </div>
                                </div>
                                <Button type="primary" size="small" shape="round" onClick={() => handleStartReview(item)}>Start</Button>
                            </div>
                        )}
                    />
                )}
            </div>

            <Modal
                title={`Performance Review for ${selectedReview?.employeeId?.name}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                destroyOnHidden
            >
                <Form layout="vertical" form={form} onFinish={handleSubmitReview}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: 24 }}>
                        {ratingFields.map(field => (
                            <Form.Item
                                key={field.name}
                                name={['ratings', field.name]}
                                label={field.label}
                                rules={[{ required: true, message: 'Rating required' }]}
                                initialValue={0}
                            >
                                <Rate character={<StarFilled />} style={{ fontSize: 18 }} />
                            </Form.Item>
                        ))}
                    </div>

                    <Form.Item name="remarks" label="Overall Remarks" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="Summarize your assessment..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit Review</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PerformanceReviews;
