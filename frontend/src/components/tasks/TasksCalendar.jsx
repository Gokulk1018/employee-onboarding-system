import React from 'react';
import { Calendar, Tag, Badge, Typography, theme } from 'antd';
import { motion } from 'framer-motion';
import locale from 'antd/es/locale/en_US';

const getInitialData = () => {
    // Current date for demo
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const data = {};
    const addEvent = (day, content, type) => {
        const key = `${currentYear}-${currentMonth + 1}-${day}`; // Simple key format, could be improved
        if (!data[key]) data[key] = [];
        data[key].push({ type, content });
    };

    addEvent(8, 'Q4 Review', 'warning');
    addEvent(10, 'Payroll Finalization', 'error');
    addEvent(15, 'Office Event', 'success');
    addEvent(22, 'Deployment', 'processing');

    return data;
};

const TasksCalendar = () => {
    const { token } = theme.useToken();
    const data = getInitialData();

    const getListData = (value) => {
        const key = `${value.year()}-${value.month() + 1}-${value.date()}`;
        return data[key] || [];
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} text={<span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.content}</span>} />
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
