import React from 'react';
import { Modal, List, Avatar, Typography, Progress, theme, Space, Tag } from 'antd';
import { TrophyOutlined, CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from '../common/CountUp';

const { Text, Title } = Typography;

const LeaderboardModal = ({ open, onClose, data = [], loading }) => {
    const { token } = theme.useToken();

    const maxPoints = data.length > 0 ? data[0].totalPoints : 100;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            title={
                <Space>
                    <TrophyOutlined style={{ color: '#f59e0b' }} />
                    <Title level={4} style={{ margin: 0 }}>Company Leaderboard</Title>
                </Space>
            }
            styles={{ body: { padding: '0 24px 24px' } }}
            closeIcon={<CloseOutlined style={{ color: token.colorTextSecondary }} />}
            centered
        >
            <div style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                paddingRight: 10,
                marginTop: 20
            }} className="custom-scrollbar">
                <List
                    loading={loading}
                    dataSource={data}
                    itemLayout="horizontal"
                    renderItem={(item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: index < 3 ? `${token.colorPrimary}08` : 'transparent',
                                borderRadius: 12,
                                marginBottom: 12,
                                border: index < 3 ? `1px solid ${token.colorPrimary}20` : `1px solid ${token.colorBorderSecondary}`
                            }}>
                                <div style={{
                                    width: 40,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : token.colorTextSecondary,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {index + 1}
                                </div>

                                <Avatar
                                    src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`}
                                    size={44}
                                    style={{ margin: '0 16px' }}
                                />

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <div>
                                            <Text strong style={{ fontSize: 15 }}>{item.name}</Text>
                                            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{item.role}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
                                                {item.totalPoints} pts
                                            </Text>
                                        </div>
                                    </div>
                                    <Progress
                                        percent={(item.totalPoints / maxPoints) * 100}
                                        showInfo={false}
                                        strokeColor={index === 0 ? '#f59e0b' : token.colorPrimary}
                                        size="small"
                                        trailColor={token.colorFillSecondary}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                />
            </div>
        </Modal>
    );
};

export default LeaderboardModal;
