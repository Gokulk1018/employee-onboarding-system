import React from 'react';
import { Row, Col, Typography } from 'antd';
import { UserAddOutlined, CalendarOutlined, FileTextOutlined, TeamOutlined, SettingOutlined, BulbOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const actions = [
    { icon: <UserAddOutlined />, label: 'Add Employee', color: '#4f46e5' },
    { icon: <CalendarOutlined />, label: 'Schedule Interview', color: '#10b981' },
    { icon: <FileTextOutlined />, label: 'Run Payroll', color: '#f59e0b' },
    { icon: <TeamOutlined />, label: 'Team Meeting', color: '#3b82f6' },
    { icon: <BulbOutlined />, label: 'New Idea', color: '#8b5cf6' },
    { icon: <SettingOutlined />, label: 'Settings', color: '#64748b' },
];

const QuickActions = () => {
    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <Title level={4} style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Quick Actions</Title>
            <Row gutter={[16, 16]}>
                {actions.map((action, index) => (
                    <Col span={8} key={index}>
                        <motion.div
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s'
                            }}
                            className="hover:border-accent"
                        >
                            <div
                                style={{
                                    fontSize: 24,
                                    color: action.color,
                                    marginBottom: 8,
                                    background: `${action.color}15`,
                                    padding: 10,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {action.icon}
                            </div>
                            <Text style={{ fontSize: 12, textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {action.label}
                            </Text>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default QuickActions;
