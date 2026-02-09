import React from 'react';
import { Card, Typography, Tag, Avatar, Space, Button, theme } from 'antd';
import { MoreOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const TaskCard = ({ task }) => {
    const { token } = theme.useToken();
    return (
        <motion.div
            layoutId={task.id}
            whileHover={{ y: -4, scale: 1.02 }}
            style={{ cursor: 'pointer' }}
        >
            <div
                className="glass-card"
                style={{
                    padding: 16,
                    borderRadius: 12,
                    border: `1px solid ${token.colorBorder}`,
                    background: token.colorBgContainer // Slightly distinct from column bg
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Tag
                        color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}
                        style={{ borderRadius: 12, marginRight: 0 }}
                    >
                        {task.priority}
                    </Tag>
                    <MoreOutlined style={{ color: token.colorTextSecondary }} />
                </div>
                <Typography.Paragraph strong style={{ marginBottom: 12, color: token.colorText }}>{task.title}</Typography.Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={4} style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                        <ClockCircleOutlined /> {task.date}
                    </Space>
                    <Avatar.Group size="small" max={{ count: 2 }}>
                        {task.assignees.map((a, i) => (
                            <Avatar key={i} src={a} style={{ border: `2px solid ${token.colorBgContainer}` }} />
                        ))}
                    </Avatar.Group>
                </div>
            </div>
        </motion.div>
    );
};

const Column = ({ title, tasks, color }) => {
    const { token } = theme.useToken();
    return (
        <div style={{ flex: 1, minWidth: 320, background: token.colorBgLayout, padding: 16, borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Typography.Text strong style={{ fontSize: 16, color: token.colorText }}>{title}</Typography.Text>
                <Tag color={color} style={{ borderRadius: 12 }}>{tasks.length}</Tag>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                <Button type="dashed" block icon={<PlusOutlined />} style={{ borderRadius: 12, height: 40, borderColor: token.colorBorder, color: token.colorTextSecondary }}>Add Task</Button>
            </div>
        </div>
    );
};

const KanbanBoard = () => {
    const tasks = {
        todo: [
            { id: '1', title: 'Design System Update', priority: 'High', date: 'Tomorrow', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=John'] },
            { id: '2', title: 'Employee Survey Analysis', priority: 'Medium', date: 'Nov 24', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'] },
        ],
        inProgress: [
            { id: '3', title: 'Q4 Performance Reviews', priority: 'High', date: 'Today', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'] },
        ],
        done: [
            { id: '4', title: 'October Payroll', priority: 'High', date: 'Nov 01', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=David'] },
            { id: '5', title: 'Onboarding Kit Revamp', priority: 'Low', date: 'Oct 28', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'] },
        ]
    };

    return (
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24 }}>
            <Column title="To Do" tasks={tasks.todo} color="default" />
            <Column title="In Progress" tasks={tasks.inProgress} color="blue" />
            <Column title="Done" tasks={tasks.done} color="green" />
        </div>
    );
};

export default KanbanBoard;
