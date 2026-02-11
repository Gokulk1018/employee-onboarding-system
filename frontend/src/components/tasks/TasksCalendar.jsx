import React from 'react';
import { Calendar, Tag, Badge, Typography, theme } from 'antd';
import { motion } from 'framer-motion';
import locale from 'antd/es/locale/en_US';

const TasksCalendar = ({ tasks = [] }) => {
    const { token } = theme.useToken();

    const getListData = (value) => {
        const dateString = value.format('YYYY-MM-DD');
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
            return taskDate === dateString;
        });
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {listData.map((item) => (
                    <li key={item._id}>
                        <Badge
                            status={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'success'}
                            text={<span style={{ fontSize: 12, color: token.colorTextSecondary }}>{item.title}</span>}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <Calendar
                locale={locale}
                dateCellRender={dateCellRender}
                className="glass-calendar"
                fullscreen={true}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                    return (
                        <div style={{ padding: 12, marginBottom: 12 }}>
                            <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                                {value.format('MMMM YYYY')}
                            </Typography.Title>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default TasksCalendar;
