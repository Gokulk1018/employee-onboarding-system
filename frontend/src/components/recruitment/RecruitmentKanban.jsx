import React from 'react';
import { Card, Typography, Tag, Avatar, Space, theme, Tooltip, Button } from 'antd';
import { MoreOutlined, CalendarOutlined, PaperClipOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;



const candidates = [
    { id: 1, name: 'Alice Smith', role: 'Frontend Dev', status: 'Applied', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', tags: ['React', 'Mid'], date: '2d ago' },
    { id: 2, name: 'Bob Jones', role: 'Backend Dev', status: 'Screening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', tags: ['Node', 'Senior'], date: '1d ago' },
    { id: 3, name: 'Charlie Day', role: 'Designer', status: 'Interview', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', tags: ['Figma', 'UI'], date: '4h ago' },
    { id: 4, name: 'David Lee', role: 'Product Manager', status: 'Offer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', tags: ['Product'], date: '1w ago' },
    { id: 5, name: 'Eve White', role: 'QA Engineer', status: 'Applied', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve', tags: ['Manual'], date: '3d ago' },
    { id: 6, name: 'Frank Miller', role: 'DevOps', status: 'Screening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank', tags: ['AWS', 'Docker'], date: '5h ago' },
    { id: 7, name: 'Grace Liu', role: 'Data Scientist', status: 'Interview', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', tags: ['Python', 'AI'], date: '2d ago' },
    { id: 8, name: 'Henry Ford', role: 'Full Stack', status: 'Applied', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', tags: ['MERN'], date: '1h ago' },
];

const RecruitmentKanban = () => {
    const { token } = theme.useToken();

    const columns = [
        { title: 'Applied', status: 'Applied', color: token.colorInfo },
        { title: 'Screening', status: 'Screening', color: token.colorPrimary },
        { title: 'Interview', status: 'Interview', color: token.colorWarning },
        { title: 'Offer', status: 'Offer', color: token.colorSuccess },
    ];

    return (
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
            {columns.map((col, colIndex) => (
                <motion.div
                    key={col.status}
                    style={{ minWidth: 300, flex: 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIndex * 0.1 }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                        padding: '12px 16px',
                        background: token.colorBgContainer,
                        borderRadius: 12,
                        boxShadow: token.boxShadow,
                        border: `1px solid ${token.colorBorder}`
                    }}>
                        <Space>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                            <Text strong style={{ color: token.colorText, fontSize: 16 }}>{col.title}</Text>
                            <Tag style={{ borderRadius: 12, border: 'none', background: `${col.color}20`, color: col.color, fontWeight: 600 }}>
                                {candidates.filter(c => c.status === col.status).length}
                            </Tag>
                        </Space>
                        <MoreOutlined style={{ color: token.colorTextSecondary, cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {candidates.filter(c => c.status === col.status).map((candidate, index) => (
                            <motion.div
                                key={candidate.id}
                                layoutId={candidate.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 + colIndex * 0.1 }}
                                className="glass-card"
                                style={{
                                    padding: 16,
                                    cursor: 'grab',
                                    borderLeft: `4px solid ${col.color}`,
                                    borderColor: token.colorBorder,
                                    background: token.colorBgContainer
                                }}
                                whileHover={{ y: -5, boxShadow: token.boxShadowSecondary, scale: 1.02, borderColor: token.colorPrimary }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Avatar src={candidate.avatar} size="large" />
                                    <Button type="text" icon={<MoreOutlined />} size="small" style={{ color: token.colorTextSecondary }} />
                                </div>
                                <div style={{ fontWeight: 600, color: token.colorText, marginBottom: 4, fontSize: 15 }}>{candidate.name}</div>
                                <div style={{ fontSize: 13, color: token.colorTextSecondary, marginBottom: 12 }}>{candidate.role}</div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                                    {candidate.tags.map(tag => (
                                        <Tag key={tag} bordered={false} style={{ background: token.colorBgLayout, color: token.colorTextSecondary }}>{tag}</Tag>
                                    ))}
                                </div>

                                <div className="flex-between" style={{ borderTop: `1px solid ${token.colorBorder}`, paddingTop: 12 }}>
                                    <Space size="small" style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                                        <PaperClipOutlined /> 2
                                    </Space>
                                    <Space size="small" style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                                        <CalendarOutlined /> {candidate.date}
                                    </Space>
                                </div>
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
                            opacity: 0.7,
                            background: 'transparent',
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            color: token.colorTextSecondary,
                            borderColor: token.colorBorder
                        }}
                        whileHover={{ opacity: 1, background: token.colorBgContainer, borderColor: token.colorPrimary, color: token.colorPrimary }}
                    >
                        + Add Candidate
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};

export default RecruitmentKanban;
