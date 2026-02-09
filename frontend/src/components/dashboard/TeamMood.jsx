import React from 'react';
import { Card, Typography, Tooltip, Progress, Avatar, theme } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const TeamMood = () => {
    const { token } = theme.useToken();
    const moods = [
        { icon: <SmileOutlined />, color: token.colorSuccess, value: 75, label: 'Happy' },
        { icon: <MehOutlined />, color: token.colorWarning, value: 20, label: 'Neutral' },
        { icon: <FrownOutlined />, color: token.colorError, value: 5, label: 'Stressed' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Team Mood</Title>
                <Tooltip title="Aggregated form weekly pulse surveys">
                    <InfoCircleOutlined style={{ color: token.colorTextSecondary }} />
                </Tooltip>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                        width: 80, height: 80,
                        borderRadius: '50%',
                        background: `${token.colorSuccess}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: token.colorSuccess, fontSize: 40,
                        border: `2px solid ${token.colorSuccess}30`
                    }}
                >
                    <SmileOutlined />
                </motion.div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {moods.map((mood, index) => (
                    <motion.div
                        key={mood.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex-between" style={{ marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: mood.color }}>{mood.icon}</span>
                                <Text style={{ color: token.colorTextSecondary }}>{mood.label}</Text>
                            </div>
                            <Text strong style={{ color: token.colorText }}>{mood.value}%</Text>
                        </div>
                        <Progress
                            percent={mood.value}
                            strokeColor={mood.color}
                            trailColor={token.colorFillSecondary}
                            showInfo={false}
                            size="small"
                        />
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${token.colorBorder}` }}>
                <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>Based on 42 responses this week</Text>
                <Avatar.Group size="small" style={{ float: 'right' }}>
                    <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
                    <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
                    <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
                </Avatar.Group>
            </div>
        </div>
    );
};

export default TeamMood;
