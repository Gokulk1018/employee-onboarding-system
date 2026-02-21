import React from 'react';
import { Row, Col, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    UserAddOutlined,
    PlusCircleOutlined,
    RocketOutlined,
    TeamOutlined,
    SettingOutlined,
    CheckSquareOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const actions = [
    { icon: <UserAddOutlined />, label: 'Add Employee', color: '#4f46e5', path: '/employees?action=add' },
    { icon: <PlusCircleOutlined />, label: 'New Task', color: '#8b5cf6', path: '/tasks?action=add' },
    { icon: <RocketOutlined />, label: 'Post Job', color: '#10b981', path: '/recruitment?action=add' },
    { icon: <TeamOutlined />, label: 'Team Meeting', color: '#3b82f6', action: 'meeting' },
    { icon: <CheckSquareOutlined />, label: 'Approve Leave', color: '#f59e0b', path: '/onboarding' },
    { icon: <SettingOutlined />, label: 'Settings', color: '#64748b', path: '/settings' },
];

const QuickActions = ({ onMeeting, onLeaveAction }) => {
    const { token } = theme.useToken();
    const navigate = useNavigate();

    const handleActionClick = (action) => {
        if (action.action === 'meeting' && onMeeting) {
            onMeeting();
        } else if (action.action === 'leave' && onLeaveAction) {
            onLeaveAction();
        } else if (action.path) {
            navigate(action.path);
        }
    };

    const actions = [
        { icon: <UserAddOutlined />, label: 'Add Employee', color: '#4f46e5', path: '/employees?action=add' },
        { icon: <PlusCircleOutlined />, label: 'New Task', color: '#8b5cf6', path: '/tasks?action=add' },
        { icon: <RocketOutlined />, label: 'Post Job', color: '#10b981', path: '/recruitment?action=add' },
        { icon: <TeamOutlined />, label: 'Team Meeting', color: '#3b82f6', action: 'meeting' },
        { icon: <CheckSquareOutlined />, label: 'Approve Leave', color: '#f59e0b', action: 'leave' },
        { icon: <SettingOutlined />, label: 'Settings', color: '#64748b', path: '/settings' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Quick Actions</Title>
            <Row gutter={[16, 16]}>
                {actions.map((action, index) => (
                    <Col span={8} key={index}>
                        <motion.div
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleActionClick(action)}

                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '16px 8px',
                                borderRadius: 12,
                                backgroundColor: token.colorBgContainer,
                                border: `1px solid ${token.colorBorder}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                height: '100%'
                            }}
                            className="quick-action-card"
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
                            <Text style={{ fontSize: 11, textAlign: 'center', color: token.colorTextSecondary, fontWeight: 500 }}>
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
