import React from 'react';
import { Typography, Progress, theme, Tag } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;



const SkillsList = () => {
    const { token } = theme.useToken();

    const skills = [
        { name: 'React', level: 90, color: token.colorInfo },
        { name: 'Node.js', level: 85, color: token.colorSuccess },
        { name: 'UI/UX Design', level: 75, color: token.colorError },
        { name: 'Python', level: 80, color: token.colorWarning },
        { name: 'SQL', level: 70, color: token.colorPrimary },
        { name: 'Project Management', level: 95, color: token.colorText },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>Top Skills</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {skills.map((skill, index) => (
                    <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex-between" style={{ marginBottom: 8 }}>
                            <Text strong style={{ color: token.colorText }}>{skill.name}</Text>
                            <Tag color={skill.color} style={{ margin: 0, color: skill.color === token.colorText ? token.colorBgContainer : undefined }}>{skill.level}%</Tag>
                        </div>
                        <Progress
                            percent={skill.level}
                            strokeColor={skill.color}
                            trailColor={token.colorFillSecondary}
                            showInfo={false}
                            strokeWidth={8}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SkillsList;
