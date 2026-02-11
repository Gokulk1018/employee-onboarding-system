import React, { useState } from 'react';
import { Typography, Button, Segmented, Input, Row, Col, Card, Statistic, Space, Badge, theme } from 'antd';
import {
    PlusOutlined,
    FilterOutlined,
    AppstoreOutlined,
    CalendarOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TasksCalendar from '../components/tasks/TasksCalendar';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import TaskFilterPanel from '../components/tasks/TaskFilterPanel';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

// Initial dummy data
const initialTasks = {
    todo: [
        {
            id: 1,
            title: 'Design System Update',
            priority: 'High',
            dueDate: 'Dec 15',
            assignee: 'John Doe',
            department: 'Design',
            tags: ['UI', 'Design'],
            attachments: 3,
            comments: 5,
            isOverdue: false,
            pinned: true
        },
        {
            id: 2,
            title: 'Employee Survey Analysis',
            priority: 'Medium',
            dueDate: 'Dec 20',
            assignee: 'Jane Smith',
            department: 'HR',
            tags: ['Survey', 'Analytics'],
            attachments: 1,
            comments: 2,
            isOverdue: false,
            pinned: false
        },
        {
            id: 3,
            title: 'Update Documentation',
            priority: 'Low',
            dueDate: 'Dec 10',
            assignee: 'Mike Johnson',
            department: 'Engineering',
            tags: ['Docs'],
            attachments: 0,
            comments: 1,
            isOverdue: true,
            pinned: false
        }
    ],
    inProgress: [
        {
            id: 4,
            title: 'Q4 Performance Reviews',
            priority: 'High',
            dueDate: 'Today',
            assignee: 'Sarah Williams',
            department: 'HR',
            tags: ['Performance', 'Review'],
            attachments: 2,
            comments: 8,
            isOverdue: false,
            pinned: false
        },
        {
            id: 5,
            title: 'Marketing Campaign',
            priority: 'Medium',
            dueDate: 'Dec 18',
            assignee: 'David Brown',
            department: 'Marketing',
            tags: ['Campaign'],
            attachments: 5,
            comments: 12,
            isOverdue: false,
            pinned: false
        }
    ],
    done: [
        {
            id: 6,
            title: 'October Payroll',
            priority: 'High',
            dueDate: 'Nov 01',
            assignee: 'Jane Smith',
            department: 'HR',
            tags: ['Payroll'],
            attachments: 1,
            comments: 3,
            isOverdue: false,
            pinned: false
        },
        {
            id: 7,
            title: 'Onboarding Kit Revamp',
            priority: 'Low',
            dueDate: 'Oct 28',
            assignee: 'John Doe',
            department: 'HR',
            tags: ['Onboarding'],
            attachments: 2,
            comments: 4,
            isOverdue: false,
            pinned: false
        }
    ]
};

import axios from 'axios';

const Tasks = () => {
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [view, setView] = useState('board');
    const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        priority: [],
        assignee: [],
        department: [],
        dueDate: null
    });

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            message.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTasks();
    }, []);

    // Calculate statistics
    const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
    const totalTasks = allTasks.length;
    const overdueTasks = allTasks.filter(t => t.isOverdue || (t.dueDate && new Date(t.dueDate) < new Date())).length;
    const dueTodayTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
    const completedTasks = tasks.done.length;

    // Filter tasks
    const filterTasks = (taskList) => {
        return taskList.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
            const matchesAssignee = filters.assignee.length === 0 || filters.assignee.includes(task.assignee);
            const matchesDepartment = filters.department.length === 0 || filters.department.includes(task.department);

            let matchesDueDate = true;
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
            const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

            if (filters.dueDate === 'overdue') matchesDueDate = isOverdue;
            if (filters.dueDate === 'today') matchesDueDate = isDueToday;

            return matchesSearch && matchesPriority && matchesAssignee && matchesDepartment && matchesDueDate;
        });
    };

    const filteredTasks = {
        todo: filterTasks(tasks.todo),
        inProgress: filterTasks(tasks.inProgress),
        done: filterTasks(tasks.done)
    };

    const handleTaskMove = async (taskId, sourceColumn, destColumn, sourceIndex, destIndex) => {
        try {
            const statusMap = {
                'todo': 'todo',
                'inProgress': 'inProgress',
                'done': 'done'
            };

            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
                status: statusMap[destColumn]
            });

            fetchTasks(); // Refresh from server
        } catch (error) {
            console.error('Error moving task:', error);
            message.error('Failed to move task');
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const statusMap = {
                'To Do': 'todo',
                'In Progress': 'inProgress',
                'Done': 'done'
            };

            const payload = {
                ...taskData,
                status: statusMap[taskData.status] || 'todo'
            };

            await axios.post('http://localhost:5000/api/tasks', payload);
            message.success('Task created successfully');
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            message.error('Failed to create task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask);
            message.success('Task updated successfully');
            setIsModalOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            message.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
            message.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('Failed to delete task');
        }
    };

    const handlePinTask = async (taskId) => {
        try {
            const task = allTasks.find(t => t._id === taskId);
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
                pinned: !task.pinned
            });
            fetchTasks();
        } catch (error) {
            console.error('Error pinning task:', error);
            message.error('Failed to pin task');
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value
        });
    };

    const handleClearFilters = () => {
        setFilters({
            priority: [],
            assignee: [],
            department: [],
            dueDate: null
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1600, margin: '0 auto' }}
            >
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">
                            Project Tasks
                        </Title>
                        <div style={{ color: token.colorTextSecondary }}>
                            Manage your projects and daily activities
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Segmented
                            options={[
                                { label: 'Board', value: 'board', icon: <AppstoreOutlined /> },
                                { label: 'Calendar', value: 'calendar', icon: <CalendarOutlined /> },
                            ]}
                            value={view}
                            onChange={setView}
                        />
                        <Badge dot={filters.priority.length > 0 || filters.assignee.length > 0 || filters.department.length > 0 || filters.dueDate}>
                            <Button icon={<FilterOutlined />} onClick={() => setIsFilterOpen(true)}>
                                Filter
                            </Button>
                        </Badge>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditingTask(null);
                                setIsModalOpen(true);
                            }}
                        >
                            Create Task
                        </Button>
                    </div>
                </div>

                {/* Summary Statistics Bar */}
                <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="glass-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: token.colorTextSecondary }}>Total Tasks</span>}
                                    value={totalTasks}
                                    prefix={<FileTextOutlined style={{ color: token.colorPrimary }} />}
                                    valueStyle={{ color: token.colorText }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="glass-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: token.colorTextSecondary }}>Overdue Tasks</span>}
                                    value={overdueTasks}
                                    prefix={<ExclamationCircleOutlined style={{ color: token.colorError }} />}
                                    valueStyle={{ color: token.colorError }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="glass-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: token.colorTextSecondary }}>Due Today</span>}
                                    value={dueTodayTasks}
                                    prefix={<ClockCircleOutlined style={{ color: token.colorWarning }} />}
                                    valueStyle={{ color: token.colorWarning }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="glass-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: token.colorTextSecondary }}>Completed Tasks</span>}
                                    value={completedTasks}
                                    prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
                                    valueStyle={{ color: token.colorSuccess }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </motion.div>

                {/* Search Bar */}
                {view === 'board' && (
                    <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                        <Input
                            placeholder="Search tasks by name..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="large"
                            allowClear
                            style={{ maxWidth: 400 }}
                        />
                    </motion.div>
                )}

                {/* Kanban Board or Calendar */}
                <motion.div variants={itemVariants}>
                    {view === 'board' ? (
                        <KanbanBoard
                            tasks={filteredTasks}
                            loading={loading}
                            onTaskMove={handleTaskMove}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onPin={handlePinTask}
                        />
                    ) : (
                        <TasksCalendar tasks={allTasks} loading={loading} />
                    )}
                </motion.div>

                {/* Create/Edit Task Modal */}
                <CreateTaskModal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(null);
                    }}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    editTask={editingTask}
                />

                {/* Filter Panel */}
                <TaskFilterPanel
                    open={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            </motion.div>
        </PageContainer>
    );
};

export default Tasks;
