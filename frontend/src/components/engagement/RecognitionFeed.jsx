import React, { useState, useEffect } from 'react';
import { List, Avatar, Typography, Tag, Button, theme, Modal, Form, Input, Select, message, Space } from 'antd';
import { LikeOutlined, TrophyTwoTone, SendOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecognitions, sendRecognition, toggleLike } from '../../services/engagementService';
import { getEmployees } from '../../services/employeeService'; // Assuming this exists to select receiver
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text, Title } = Typography;
const { Option } = Select;

const RecognitionFeed = () => {
    const { token } = theme.useToken();
    const [recognitions, setRecognitions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recogRes, empRes] = await Promise.all([
                getRecognitions(),
                getEmployees()
            ]);
            if (recogRes.success) setRecognitions(recogRes.data);
            if (empRes.success) setEmployees(empRes.data);
        } catch (error) {
            console.error('Error fetching recognition data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGiveKudos = async (values) => {
        try {
            const res = await sendRecognition(values);
            if (res.success) {
                message.success('Kudos sent successfully!');
                setIsModalVisible(false);
                form.resetFields();
                fetchData();
            }
        } catch (error) {
            message.error('Failed to send kudos');
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await toggleLike(id);
            if (res.success) {
                setRecognitions(prev => prev.map(item =>
                    item._id === id ? { ...item, likes: res.data } : item
                ));
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Recognition Feed</Title>
                <Button
                    type="primary"
                    icon={<TrophyTwoTone twoToneColor="#fcd34d" />}
                    ghost
                    onClick={() => setIsModalVisible(true)}
                    style={{ borderRadius: 8 }}
                >
                    Give Kudos
                </Button>
            </div>

            <List
                loading={loading}
                itemLayout="vertical"
                dataSource={recognitions}
                locale={{ emptyText: 'No recognitions yet. Be the first to give kudos!' }}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <List.Item style={{ padding: '20px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                            <div className="flex-between" style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar.Group max={{ count: 2 }} size="small">
                                        <Avatar src={item.senderId?.avatar} style={{ border: `2px solid ${token.colorBgContainer}` }} />
                                        <Avatar src={item.receiverId?.avatar} style={{ border: `2px solid ${token.colorBgContainer}` }} />
                                    </Avatar.Group>
                                    <div>
                                        <Text strong>{item.senderId?.name}</Text>
                                        <Text type="secondary" style={{ margin: '0 4px' }}>to</Text>
                                        <Text strong>{item.receiverId?.name}</Text>
                                    </div>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.createdAt).fromNow()}</Text>
                            </div>

                            <div style={{
                                background: token.colorBgLayout,
                                padding: 16,
                                borderRadius: 12,
                                marginBottom: 12,
                                border: `1px solid ${token.colorBorderSecondary}`
                            }}>
                                <Text style={{ fontSize: 15, fontStyle: 'italic', color: token.colorText }}>
                                    "{item.message}"
                                </Text>
                                <div style={{ marginTop: 12 }}>
                                    <Tag color="gold" style={{ borderRadius: 12 }}>#{item.category}</Tag>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<LikeOutlined />}
                                    onClick={() => handleLike(item._id)}
                                    style={{ color: item.likes?.includes(JSON.parse(localStorage.getItem('user'))?.data?.userId) ? token.colorPrimary : token.colorTextSecondary }}
                                >
                                    {item.likes?.length || 0} Likes
                                </Button>
                            </div>
                        </List.Item>
                    </motion.div>
                )}
            />

            <Modal
                title="Give Kudos"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleGiveKudos}>
                    <Form.Item name="receiverId" label="Who are you recognizing?" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Select an employee" filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                            {employees.map(emp => (
                                <Option key={emp._id} value={emp._id}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="category" label="Category" initialValue="Teamwork" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Teamwork">Teamwork</Option>
                            <Option value="Innovation">Innovation</Option>
                            <Option value="Leadership">Leadership</Option>
                            <Option value="Helpfulness">Helpfulness</Option>
                            <Option value="Excellence">Excellence</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="message" label="Message" rules={[{ required: true, min: 5 }]}>
                        <Input.TextArea rows={3} placeholder="What did they do well?" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>Send Kudus</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RecognitionFeed;
