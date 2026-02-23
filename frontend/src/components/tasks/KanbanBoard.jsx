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

const TaskCard = ({ task, onDetail, onEdit, onDelete, onPin, onMoveLeft, onMoveRight, showMoveLeft, showMoveRight }) => {
    const { token } = theme.useToken();

    const isOverdue = task.status !== 'done' && task.isOverdue;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return token.colorError;
            case 'Medium': return token.colorWarning;
            case 'Low': return token.colorSuccess;
            default: return token.colorTextSecondary;
        }
    };

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

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            style={{ marginBottom: 12, cursor: 'pointer' }}
            onClick={() => onDetail(task)}
        >
            <div
                className="glass-card"
                style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${task.pinned ? token.colorPrimary : token.colorBorder}`,
                    background: task.pinned ? `${token.colorPrimary}05` : token.colorBgContainer,
                    position: 'relative'
                }}
            >
                {task.pinned && (
                    <PushpinOutlined
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            color: token.colorPrimary,
                            fontSize: 12
                        }}
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <Tag
                        bordered={false}
                        style={{
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            background: `${getPriorityColor(task.priority)}15`,
                            color: getPriorityColor(task.priority)
                        }}
                    >
                        {task.priority}
                    </Tag>
                    <span onClick={(e) => e.stopPropagation()}>
                        <Dropdown menu={menuItems} trigger={['click']}>
                            <MoreOutlined style={{ color: token.colorTextSecondary, cursor: 'pointer' }} />
                        </Dropdown>
                    </span>
                </div>

                <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                    {task.title}
                </Text>

                {task.tags && task.tags.length > 0 && (
                    <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {task.tags.map((tag, index) => (
                            <Tag key={index} bordered={false} style={{ fontSize: '10px', margin: 0 }}>
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
                                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
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
                    <Avatar.Group
                        max={{
                            count: 3,
                            style: { color: '#f56a00', backgroundColor: '#fde3cf' }
                        }}
                        size="small"
                    >
                        {task.assignees?.map(assignee => (
                            <Tooltip key={assignee._id} title={assignee.name}>
                                <Avatar
                                    src={assignee.avatar}
                                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                                >
                                    {assignee.name?.charAt(0)}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
            </div>
        </motion.div>
    );
};

const Column = ({ title, tasks, columnId, color, onDetail, onEdit, onDelete, onPin, onMoveLeft, onMoveRight }) => {
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

            <div style={{
                height: 'calc(100vh - 350px)',
                minHeight: 500,
                overflowY: 'auto',
                paddingRight: 4,
                scrollbarWidth: 'thin',
                msOverflowStyle: 'none'
            }}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        onDetail={onDetail}
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

const KanbanBoard = ({ tasks, onTaskMove, onDetail, onEdit, onDelete, onPin }) => {
    const { token } = theme.useToken();

    const handleMoveRight = (taskId, sourceColumn) => {
        const columnOrder = ['todo', 'inProgress', 'done'];
        const currentIndex = columnOrder.indexOf(sourceColumn);
        if (currentIndex < columnOrder.length - 1) {
            const destColumn = columnOrder[currentIndex + 1];
            onTaskMove(taskId, sourceColumn, destColumn);
            message.success('Task moved successfully');
        }
    };

    const handleMoveLeft = (taskId, sourceColumn) => {
        const columnOrder = ['todo', 'inProgress', 'done'];
        const currentIndex = columnOrder.indexOf(sourceColumn);
        if (currentIndex > 0) {
            const destColumn = columnOrder[currentIndex - 1];
            onTaskMove(taskId, sourceColumn, destColumn);
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
                    onDetail={onDetail}
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
                    onDetail={onDetail}
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
                    onDetail={onDetail}
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
