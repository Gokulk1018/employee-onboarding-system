import React, { useState, useEffect } from 'react';
import { List, Avatar, Progress, Typography, theme, Button, Tag, Modal, Form, Input, Select, DatePicker, message, Space, Row, Col } from 'antd';
import { PlusOutlined, MoreOutlined, FlagOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getGoals, createGoal } from '../../services/performanceService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const PerformanceGoals = () => {
    const { token } = theme.useToken();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await getGoals();
            if (res.success) {
                setGoals(res.data);
            }
        } catch (error) {
            console.error('Fetch goals error:', error);
            // Non-blocking for now, can add notification
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleAddGoal = async (values) => {
        try {
            const res = await createGoal({
                ...values,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null
            });
            if (res.success) {
                message.success('Goal added successfully');
                setIsModalVisible(false);
                form.resetFields();
                fetchGoals();
            }
        } catch (error) {
            message.error('Failed to add goal');
        }
    };

    const getPriorityTag = (priority) => {
        const colors = { High: 'red', Medium: 'orange', Low: 'green' };
        return <Tag color={colors[priority] || 'blue'} style={{ borderRadius: 12 }}>{priority}</Tag>;
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0, color: token.colorText }}>Employee Goals</Title>
                    <Text type="secondary">Manage and track performance objectives</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    style={{ borderRadius: 8 }}
                >
                    Add Goal
                </Button>
            </div>

            <List
                loading={loading}
                dataSource={goals}
                locale={{ emptyText: 'No goals found. Start by adding one!' }}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <List.Item
                            style={{
                                padding: '16px 0',
                                borderBottom: `1px solid ${token.colorBorderSecondary}`
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<FlagOutlined />}
                                        style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }}
                                    />
                                }
                                title={
                                    <div className="flex-between">
                                        <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                                        {getPriorityTag(item.priority)}
                                    </div>
                                }
                                description={
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>{item.description}</Text>
                                        <div className="flex-between" style={{ gap: 20 }}>
                                            <div style={{ flex: 1 }}>
                                                <Progress
                                                    percent={item.progress}
                                                    size="small"
                                                    strokeColor={item.progress >= 100 ? token.colorSuccess : token.colorPrimary}
                                                />
                                            </div>
                                            <Space style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                                                <CalendarOutlined />
                                                <span>{item.dueDate ? dayjs(item.dueDate).format('MMM DD, YYYY') : 'No date'}</span>
                                            </Space>
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    </motion.div>
                )}
            />

            <Modal
                title="Add New Goal"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnHidden
            >
                <Form layout="vertical" form={form} onFinish={handleAddGoal}>
                    <Form.Item name="title" label="Goal Title" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Complete Project X" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Describe the outcome..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="priority" label="Priority" initialValue="Medium">
                                <Select>
                                    <Option value="High">High</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="Low">Low</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dueDate" label="Due Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="category" label="Category" initialValue="Professional">
                        <Select>
                            <Option value="Professional">Professional</Option>
                            <Option value="Project">Project</Option>
                            <Option value="Learning">Learning</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create Goal</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PerformanceGoals;
