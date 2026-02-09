import React, { useState } from 'react';
import { Typography, Button, Segmented } from 'antd';
import { PlusOutlined, FilterOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TasksCalendar from '../components/tasks/TasksCalendar';
import CreateTaskDrawer from '../components/tasks/CreateTaskDrawer';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Tasks = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [view, setView] = useState('board');

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
                        <Title level={2} style={{ margin: 0 }} className="text-gradient">Project Tasks</Title>
                        <div style={{ color: 'var(--text-secondary)' }}>Manage your projects and daily activities</div>
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
                        <Button icon={<FilterOutlined />}>Filter</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Create Task</Button>
                    </div>
                </div>

                <motion.div variants={itemVariants}>
                    {view === 'board' ? <KanbanBoard /> : <TasksCalendar />}
                </motion.div>

                <CreateTaskDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            </motion.div>
        </PageContainer>
    );
};

export default Tasks;
