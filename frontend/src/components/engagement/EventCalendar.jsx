import React from 'react';
import { Card, Calendar, Badge, Typography, Space, theme } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const EventCalendar = () => {
    const { token } = theme.useToken();

    const getListData = (value) => {
        const date = value.date();
        if (date === 18) return [{ type: 'warning', content: 'Town Hall' }];
        if (date === 22) return [{ type: 'success', content: 'Fun Friday' }];
        if (date === 25) return [{ type: 'error', content: 'Survey Deadline' }];
        return [];
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card
            className="glass-card"
            title={
                <Space>
                    <CalendarOutlined style={{ color: token.colorPrimary }} />
                    <Title level={4} style={{ margin: 0 }}>Event Calendar</Title>
                </Space>
            }
            styles={{ body: { padding: 12 } }}
            style={{ borderRadius: 24, height: '100%' }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div style={{ border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 12, overflow: 'hidden' }}>
                    <Calendar
                        fullscreen={false}
                        cellRender={(current, info) => info.type === 'date' ? dateCellRender(current) : info.originNode}
                        headerRender={({ value, type, onChange, onTypeChange }) => (
                            <div style={{ padding: 12, textAlign: 'center' }}>
                                <Text strong>{value.format('MMMM YYYY')}</Text>
                            </div>
                        )}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <Title level={5} style={{ fontSize: 13, marginBottom: 8 }}>Next Event:</Title>
                    <div style={{ background: token.colorWarningBg, padding: 8, borderRadius: 8, borderLeft: '4px solid orange' }}>
                        <Text strong style={{ fontSize: 12 }}>Town Hall Meeting</Text>
                        <Text style={{ display: 'block', fontSize: 11 }} type="secondary">Feb 18, 2026 • 10:00 AM</Text>
                    </div>
                </div>
            </motion.div>
        </Card>
    );
};

export default EventCalendar;
