import React, { useState } from 'react';
import { Typography, Button, Segmented, Input, Row, Col, Card, Statistic, Space, Badge, theme, App } from 'antd';
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
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import axios from 'axios';

const { Title } = Typography;

// Initial tasks state is managed by fetchTasks from the backend.

const Tasks = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [view, setView] = useState('board');
    const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
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

    const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
            const response = await axios.get('http://localhost:5000/api/employees');
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoadingEmployees(false);
        }
    };

    React.useEffect(() => {
        fetchTasks();
        fetchEmployees();
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
            const matchesAssignee = filters.assignee.length === 0 || task.assignees?.some(a => filters.assignee.includes(a._id || a));
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

            await axios.post('http://localhost:5000/api/tasks/create', payload);
            message.success('Task created successfully');
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            message.error('Failed to create task');
        }
    };

    const handleEditTask = (task) => {
        // Map backend status back to frontend label for the form
        const revStatusMap = {
            'todo': 'To Do',
            'inProgress': 'In Progress',
            'done': 'Done'
        };

        setEditingTask({
            ...task,
            status: revStatusMap[task.status] || 'To Do'
        });
        setIsModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            const statusMap = {
                'To Do': 'todo',
                'In Progress': 'inProgress',
                'Done': 'done'
            };

            const payload = {
                ...updatedTask,
                status: statusMap[updatedTask.status] || updatedTask.status
            };

            await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, payload);
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
        }
    };

    const handleViewTask = (task) => {
        setViewingTask(task);
        setIsDetailOpen(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            priority: [],
            assignee: [],
            department: [],
            dueDate: null
        });
    };

    const stats = [
        { title: 'Total Tasks', value: totalTasks, icon: <FileTextOutlined />, color: token.colorPrimary },
        { title: 'Completed', value: completedTasks, icon: <CheckCircleOutlined />, color: token.colorSuccess },
        { title: 'Due Today', value: dueTodayTasks, icon: <ClockCircleOutlined />, color: token.colorWarning },
        { title: 'Overdue', value: overdueTasks, icon: <ExclamationCircleOutlined />, color: token.colorError },
    ];

    return (
        <PageContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]} align="middle" justify="space-between">
                        <Col>
                            <Title level={2} style={{ margin: 0, color: token.colorText }}>Task Management</Title>
                        </Col>
                        <Col>
                            <Space size="middle">
                                <Input
                                    placeholder="Search tasks..."
                                    prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 300, borderRadius: 10 }}
                                />
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => setIsFilterOpen(true)}
                                    style={{ borderRadius: 10 }}
                                >
                                    Filters
                                </Button>
                                <Segmented
                                    value={view}
                                    onChange={setView}
                                    options={[
                                        { value: 'board', icon: <AppstoreOutlined />, label: 'Board' },
                                        { value: 'calendar', icon: <CalendarOutlined />, label: 'Calendar' }
                                    ]}
                                    style={{ borderRadius: 10 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditingTask(null);
                                        setIsModalOpen(true);
                                    }}
                                    style={{ borderRadius: 10 }}
                                >
                                    New Task
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card variant="borderless" style={{ borderRadius: 20 }}>
                                <Statistic
                                    title={<span style={{ color: token.colorTextSecondary }}>{stat.title}</span>}
                                    value={stat.value}
                                    prefix={<span style={{ color: stat.color, marginRight: 8 }}>{stat.icon}</span>}
                                    valueStyle={{ color: token.colorText, fontWeight: 'bold' }}
                                />
                                <Badge
                                    status="processing"
                                    text={<span style={{ fontSize: 12, color: token.colorTextTertiary }}>Live Tracking</span>}
                                    style={{ marginTop: 8 }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {view === 'board' ? (
                        <KanbanBoard
                            tasks={filteredTasks}
                            loading={loading}
                            onTaskMove={handleTaskMove}
                            onDetail={handleViewTask}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onPin={handlePinTask}
                        />
                    ) : (
                        <TasksCalendar tasks={allTasks} loading={loading} />
                    )}
                </motion.div>

                {/* Task Detail View */}
                <TaskDetailDrawer
                    open={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    task={viewingTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onPin={handlePinTask}
                />

                {/* Create/Edit Task Modal */}
                <CreateTaskModal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(null);
                    }}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    editTask={editingTask}
                    employees={employees}
                    loadingEmployees={loadingEmployees}
                />

                {/* Filter Panel */}
                <TaskFilterPanel
                    open={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    employees={employees}
                />
            </motion.div>
        </PageContainer>
    );
};

export default Tasks;
