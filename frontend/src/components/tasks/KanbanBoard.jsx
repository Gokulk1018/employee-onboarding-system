import React from 'react';
import { Card, Typography, Tag, Avatar, Space, Button, Dropdown } from 'antd';
import { MoreOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const Column = ({ title, tasks, color }) => (
    <div style={{ flex: 1, minWidth: 300, background: '#f1f5f9', padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Typography.Text strong>{title}</Typography.Text>
            <Tag color={color}>{tasks.length}</Tag>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tasks.map((task, index) => (
                <motion.div
                    key={task.id}
                    layoutId={task.id}
                    whileHover={{ y: -2 }}
                    style={{ cursor: 'pointer' }}
                >
                    <Card
                        bordered={false}
                        size="small"
                        style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>{task.priority}</Tag>
                            <MoreOutlined style={{ color: '#94a3b8' }} />
                        </div>
                        <Typography.Paragraph strong style={{ marginBottom: 8 }}>{task.title}</Typography.Paragraph>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space size={4} style={{ color: '#64748b', fontSize: 12 }}>
                                <ClockCircleOutlined /> {task.date}
                            </Space>
                            <Avatar.Group size="small" maxCount={2}>
                                {task.assignees.map(a => <Avatar key={a} src={a} />)}
                            </Avatar.Group>
                        </div>
                    </Card>
                </motion.div>
            ))}
            <Button type="dashed" block icon={<PlusOutlined />}>Add Task</Button>
        </div>
    </div>
);

const KanbanBoard = () => {
    // Mock Data
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
