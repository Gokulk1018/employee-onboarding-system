import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Typography, Tag, Button,
    Space, List, Avatar, Badge, theme, Tabs,
    Empty, Tooltip, Input, App
} from 'antd';
import {
    CheckCircleOutlined, ClockCircleOutlined,
    RocketOutlined, FilterOutlined, SearchOutlined,
    CalendarOutlined, ProjectOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const EmployeeTasks = () => {
    const { token } = theme.useToken();
    const { message: msg } = App.useApp();
    const { isDarkMode } = useTheme();
    const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:5000/api/employees/me/dashboard/${userId}`);
                if (response.data.success) {
                    const allTasks = response.data.data.tasks.list;
                    const grouped = {
                        todo: allTasks.filter(t => t.status === 'todo'),
                        inProgress: allTasks.filter(t => t.status === 'inProgress'),
                        done: allTasks.filter(t => t.status === 'done')
                    };
                    setTasks(grouped);
                }
            } catch (error) {
                msg.error('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const TaskCard = ({ task }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <Card
                size="small"
                style={{ marginBottom: 16, borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
                className="task-card-hover"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                        {task.priority}
                    </Tag>
                    <Tooltip title="Estimated Hours">
                        <Tag icon={<ClockCircleOutlined />}>{task.estimatedHours || 0}h</Tag>
                    </Tooltip>
                </div>
                <Title level={5} style={{ margin: '0 0 8px 0' }}>{task.title}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>{task.description}</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="small">
                        <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(task.dueDate).format('MMM DD')}</Text>
                    </Space>
                    <Space>
                        {task.status !== 'done' && (
                            <Button type="primary" size="small" ghost style={{ borderRadius: 6 }}>
                                Update
                            </Button>
                        )}
                        {task.status === 'done' && <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: 18 }} />}
                    </Space>
                </div>
            </Card>
        </motion.div>
    );

    const TaskColumn = ({ title, status, tasks, icon }) => (
        <Col xs={24} lg={8}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <Avatar size="small" icon={icon} style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }} />
                    <Title level={4} style={{ margin: 0 }}>{title}</Title>
                </Space>
                <Badge count={tasks.length} color={token.colorPrimary} />
            </div>
            <div style={{ minHeight: 400, padding: 8, background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 20 }}>
                {tasks.length > 0 ? (
                    tasks.map(task => <TaskCard key={task._id} task={task} />)
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tasks" />
                )}
            </div>
        </Col>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2}>My Tasks</Title>
                    <Text type="secondary">Manage and track your daily work assignments</Text>
                </div>
                <Space>
                    <Input prefix={<SearchOutlined />} placeholder="Search tasks..." style={{ width: 250, borderRadius: 10 }} />
                    <Button icon={<FilterOutlined />} style={{ borderRadius: 10 }}>Filter</Button>
                </Space>
            </div>

            <Row gutter={24}>
                <TaskColumn
                    title="To Do"
                    status="todo"
                    tasks={tasks.todo}
                    icon={<ClockCircleOutlined />}
                />
                <TaskColumn
                    title="In Progress"
                    status="inProgress"
                    tasks={tasks.inProgress}
                    icon={<RocketOutlined />}
                />
                <TaskColumn
                    title="Completed"
                    status="done"
                    tasks={tasks.done}
                    icon={<CheckCircleOutlined />}
                />
            </Row>
        </motion.div>
    );
};

export default EmployeeTasks;
