import React from 'react';
import { Card, Typography, Tag, Avatar, Space, Dropdown, Tooltip, Badge, Button, theme, message } from 'antd';
import {
    MoreOutlined,
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PushpinOutlined,
    CommentOutlined,
    PaperClipOutlined,
    ExclamationCircleOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;

const TaskCard = ({ task, onEdit, onDelete, onPin, onMoveLeft, onMoveRight, showMoveLeft, showMoveRight }) => {
    const { token } = theme.useToken();

    const isOverdue = task.isOverdue;

    const menuItems = {
        items: [
            {
                key: 'edit',
                label: 'Edit Task',
                icon: <EditOutlined />,
                onClick: () => onEdit(task)
            },
            {
                key: 'pin',
                label: task.pinned ? 'Unpin' : 'Pin',
                icon: <PushpinOutlined />,
                onClick: () => onPin(task._id)
            },
            {
                key: 'comment',
                label: 'Add Comment',
                icon: <CommentOutlined />
            },
            ...(showMoveLeft ? [{
                key: 'moveLeft',
                label: 'Move Left',
                icon: <ArrowLeftOutlined />,
                onClick: () => onMoveLeft(task._id)
            }] : []),
            ...(showMoveRight ? [{
                key: 'moveRight',
                label: 'Move Right',
                icon: <ArrowRightOutlined />,
                onClick: () => onMoveRight(task._id)
            }] : []),
            {
                type: 'divider'
            },
            {
                key: 'delete',
                label: 'Delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => onDelete(task._id)
            }
        ]
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return token.colorError;
            case 'Medium': return token.colorWarning;
            case 'Low': return token.colorSuccess;
            default: return token.colorTextSecondary;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            style={{ marginBottom: 12 }}
        >
            <div
                className="glass-card"
                style={{
                    padding: 16,
                    borderRadius: 12,
                    border: `1px solid ${task.pinned ? token.colorPrimary : token.colorBorder}`,
                    background: token.colorBgContainer,
                    position: 'relative'
                }}
            >
                {task.pinned && (
                    <PushpinOutlined
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: token.colorPrimary,
                            fontSize: 12
                        }}
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Tag
                        color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}
                        style={{ borderRadius: 12, marginRight: 0 }}
                    >
                        {task.priority}
                    </Tag>
                    <Dropdown menu={menuItems} trigger={['click']}>
                        <MoreOutlined style={{ color: token.colorTextSecondary, cursor: 'pointer' }} />
                    </Dropdown>
                </div>

                <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                    {task.title}
                </Text>

                {task.tags && task.tags.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        {task.tags.slice(0, 2).map((tag, i) => (
                            <Tag key={i} bordered={false} style={{ fontSize: 11, marginRight: 4 }}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={12} style={{ fontSize: 12 }}>
                        <Tooltip title={task.dueDate}>
                            <Space size={4} style={{ color: isOverdue ? token.colorError : token.colorTextSecondary }}>
                                {isOverdue && <ExclamationCircleOutlined />}
                                <ClockCircleOutlined />
                                <span>{task.dueDate}</span>
                            </Space>
                        </Tooltip>
                        {task.attachments > 0 && (
                            <Space size={4} style={{ color: token.colorTextSecondary }}>
                                <PaperClipOutlined />
                                <span>{task.attachments}</span>
                            </Space>
                        )}
                        {task.comments > 0 && (
                            <Space size={4} style={{ color: token.colorTextSecondary }}>
                                <CommentOutlined />
                                <span>{task.comments}</span>
                            </Space>
                        )}
                    </Space>
                    <Tooltip title={task.assignee}>
                        <Avatar size="small" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                            {task.assignee.charAt(0)}
                        </Avatar>
                    </Tooltip>
                </div>
            </div>
        </motion.div>
    );
};

const Column = ({ title, tasks, columnId, color, onEdit, onDelete, onPin, onMoveLeft, onMoveRight }) => {
    const { token } = theme.useToken();

    return (
        <div style={{
            flex: 1,
            minWidth: 320,
            background: `${token.colorBgLayout}80`,
            padding: 16,
            borderRadius: 16,
            border: `1px solid ${token.colorBorder}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong style={{ fontSize: 16, color: token.colorText }}>{title}</Text>
                <Badge
                    count={tasks.length}
                    style={{ backgroundColor: color }}
                    overflowCount={99}
                />
            </div>

            <div style={{ minHeight: 400 }}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPin={onPin}
                        onMoveLeft={columnId !== 'todo' ? () => onMoveLeft(task._id, columnId) : null}
                        onMoveRight={columnId !== 'done' ? () => onMoveRight(task._id, columnId) : null}
                        showMoveLeft={columnId !== 'todo'}
                        showMoveRight={columnId !== 'done'}
                    />
                ))}
            </div>
        </div>
    );
};

const KanbanBoard = ({ tasks, onTaskMove, onEdit, onDelete, onPin }) => {
    const { token } = theme.useToken();

    const handleMoveRight = (taskId, sourceColumn) => {
        const columnOrder = ['todo', 'inProgress', 'done'];
        const currentIndex = columnOrder.indexOf(sourceColumn);
        if (currentIndex < columnOrder.length - 1) {
            const destColumn = columnOrder[currentIndex + 1];
            const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === taskId);
            onTaskMove(taskId, sourceColumn, destColumn, sourceIndex, 0);
            message.success('Task moved successfully');
        }
    };

    const handleMoveLeft = (taskId, sourceColumn) => {
        const columnOrder = ['todo', 'inProgress', 'done'];
        const currentIndex = columnOrder.indexOf(sourceColumn);
        if (currentIndex > 0) {
            const destColumn = columnOrder[currentIndex - 1];
            const sourceIndex = tasks[sourceColumn].findIndex(t => t.id === taskId);
            onTaskMove(taskId, sourceColumn, destColumn, sourceIndex, 0);
            message.success('Task moved successfully');
        }
    };

    return (
        <div>
            <div style={{
                marginBottom: 16,
                padding: 12,
                background: `${token.colorWarning}15`,
                border: `1px solid ${token.colorWarning}30`,
                borderRadius: 8
            }}>
                <Text style={{ color: token.colorText, fontSize: 13 }}>
                    ℹ️ Drag-and-drop is temporarily disabled. Use the dropdown menu (⋮) on each task card to move tasks between columns.
                </Text>
            </div>
            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24 }}>
                <Column
                    title="To Do"
                    tasks={tasks.todo}
                    columnId="todo"
                    color={token.colorTextSecondary}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPin={onPin}
                    onMoveLeft={handleMoveLeft}
                    onMoveRight={handleMoveRight}
                />
                <Column
                    title="In Progress"
                    tasks={tasks.inProgress}
                    columnId="inProgress"
                    color={token.colorInfo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPin={onPin}
                    onMoveLeft={handleMoveLeft}
                    onMoveRight={handleMoveRight}
                />
                <Column
                    title="Done"
                    tasks={tasks.done}
                    columnId="done"
                    color={token.colorSuccess}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPin={onPin}
                    onMoveLeft={handleMoveLeft}
                    onMoveRight={handleMoveRight}
                />
            </div>
        </div>
    );
};

export default KanbanBoard;
