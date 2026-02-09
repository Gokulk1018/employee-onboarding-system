import React from 'react';
import { Card, Typography, Tag, Avatar, Space, theme } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const columns = [
    { title: 'Applied', status: 'Applied', color: '#3b82f6' },
    { title: 'Screening', status: 'Screening', color: '#6366f1' },
    { title: 'Interview', status: 'Interview', color: '#8b5cf6' },
    { title: 'Offer', status: 'Offer', color: '#10b981' },
];

const candidates = [
    { id: 1, name: 'Alice Smith', role: 'Frontend Dev', status: 'Applied', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 2, name: 'Bob Jones', role: 'Backend Dev', status: 'Screening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: 3, name: 'Charlie Day', role: 'Designer', status: 'Interview', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
    { id: 4, name: 'David Lee', role: 'Product Manager', status: 'Offer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 5, name: 'Eve White', role: 'QA Engineer', status: 'Applied', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve' },
];

const RecruitmentKanban = () => {
    const { token } = theme.useToken();

    return (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
            {columns.map((col) => (
                <div key={col.status} style={{ minWidth: 280, flex: 1 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                        padding: '0 8px'
                    }}>
                        <Space>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                            <Text strong style={{ color: 'var(--text-primary)' }}>{col.title}</Text>
                            <Tag style={{ borderRadius: 10, border: 'none', background: `${col.color}20`, color: col.color }}>
                                {candidates.filter(c => c.status === col.status).length}
                            </Tag>
                        </Space>
                        <MoreOutlined style={{ color: 'var(--text-secondary)' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {candidates.filter(c => c.status === col.status).map((candidate, index) => (
                            <motion.div
                                key={candidate.id}
                                layoutId={candidate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card"
                                style={{ padding: 16, cursor: 'grab' }}
                                whileHover={{ y: -4, boxShadow: token.boxShadow }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Avatar src={candidate.avatar} />
                                    <Tag>High</Tag>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{candidate.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{candidate.role}</div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="glass-panel"
                        style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 12,
                            textAlign: 'center',
                            cursor: 'pointer',
                            opacity: 0.6,
                            background: 'transparent',
                            borderStyle: 'dashed'
                        }}
                        whileHover={{ opacity: 1, background: 'var(--glass-bg)' }}
                    >
                        + Add Candidate
                    </motion.div>
                </div>
            ))}
        </div>
    );
};

export default RecruitmentKanban;
