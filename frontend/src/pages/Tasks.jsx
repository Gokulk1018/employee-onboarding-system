import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CreateTaskDrawer from '../components/tasks/CreateTaskDrawer';
import { motion } from 'framer-motion';

const { Title } = Typography;

const Tasks = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Project Tasks</Title>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Button icon={<FilterOutlined />}>Filter</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Create Task</Button>
                </div>
            </div>

            <KanbanBoard />

            <CreateTaskDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </motion.div>
    );
};

export default Tasks;
