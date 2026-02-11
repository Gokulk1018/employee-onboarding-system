import React from 'react';
import { Drawer, Typography, Tag, Space, Avatar, Button, Divider, List, Checkbox, theme, Tooltip } from 'antd';
import {
    ClockCircleOutlined,
    PushpinOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    CalendarOutlined,
    TagOutlined,
    TeamOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TaskDetailDrawer = ({ open, onClose, task, onEdit, onDelete, onPin }) => {
    const { token } = theme.useToken();

    if (!task) return null;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'red';
            case 'Medium': return 'orange';
            case 'Low': return 'green';
            default: return 'default';
        }
    };

    const StatusTag = ({ status }) => {
        const config = {
            todo: { color: 'default', text: 'To Do' },
            inProgress: { color: 'blue', text: 'In Progress' },
            done: { color: 'success', text: 'Done' }
        };
        const { color, text } = config[status] || config.todo;
        return <Tag color={color} style={{ borderRadius: 12 }}>{text}</Tag>;
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
                    <span>Task Details</span>
                    <Space>
                        <Tooltip title={task.pinned ? 'Unpin' : 'Pin'}>
                            <Button
                                type="text"
                                icon={<PushpinOutlined style={{ color: task.pinned ? token.colorPrimary : 'inherit' }} />}
                                onClick={() => onPin(task._id)}
                            />
                        </Tooltip>
                        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => { onEdit(task); onClose(); }}>Edit</Button>
                        <Button danger icon={<DeleteOutlined />} onClick={() => { onDelete(task._id); onClose(); }}>Delete</Button>
                    </Space>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={500}
            closeIcon={<CloseOutlined />}
        >
            <div style={{ padding: '0 8px' }}>
                <Title level={4} style={{ color: token.colorText, marginBottom: 16 }}>{task.title}</Title>

                <Space style={{ marginBottom: 24, flexWrap: 'wrap' }} size={[8, 16]}>
                    <StatusTag status={task.status} />
                    <Tag color={getPriorityColor(task.priority)} style={{ borderRadius: 12 }}>{task.priority} Priority</Tag>
                    {task.department && <Tag icon={<InfoCircleOutlined />} style={{ borderRadius: 12 }}>{task.department}</Tag>}
                </Space>

                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>
                        <CalendarOutlined style={{ marginRight: 8 }} /> DUE DATE
                    </Text>
                    <Text style={{ fontSize: 16, color: task.isOverdue ? token.colorError : token.colorText }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : 'No due date'}
                    </Text>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>
                        <TeamOutlined style={{ marginRight: 8 }} /> ASSIGNEES
                    </Text>
                    <Avatar.Group max={{ count: 5 }}>
                        {task.assignees?.map(assignee => (
                            <Tooltip key={assignee._id} title={`${assignee.name} (${assignee.email})`}>
                                <Avatar src={assignee.avatar} size="large">
                                    {assignee.name?.charAt(0)}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                    <div style={{ marginTop: 8 }}>
                        {task.assignees?.map(assignee => (
                            <div key={assignee._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text style={{ color: token.colorText }}>{assignee.name}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>{assignee.email}</Text>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider style={{ margin: '24px 0' }} />

                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>DESCRIPTION</Text>
                    <Paragraph style={{ color: token.colorText }}>
                        {task.description || 'No description provided.'}
                    </Paragraph>
                </div>

                {task.tags && task.tags.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>
                            <TagOutlined style={{ marginRight: 8 }} /> TAGS
                        </Text>
                        <Space wrap>
                            {task.tags.map((tag, i) => (
                                <Tag key={i} bordered={false} style={{ background: `${token.colorPrimary}15`, color: token.colorPrimary }}>
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                )}

                {task.subtasks && task.subtasks.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>
                            SUBTASKS ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                        </Text>
                        <List
                            dataSource={task.subtasks}
                            renderItem={item => (
                                <List.Item style={{ padding: '8px 0', border: 'none' }}>
                                    <Space>
                                        <Checkbox checked={item.completed} disabled />
                                        <Text delete={item.completed} style={{ color: item.completed ? token.colorTextQuaternary : token.colorText }}>
                                            {item.text}
                                        </Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>
                )}

                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorTextSecondary }}>
                        <ClockCircleOutlined style={{ marginRight: 8 }} /> ESTIMATED TIME
                    </Text>
                    <Text style={{ color: token.colorText }}>{task.estimatedHours || 0} Hours</Text>
                </div>
            </div>
        </Drawer>
    );
};

export default TaskDetailDrawer;
