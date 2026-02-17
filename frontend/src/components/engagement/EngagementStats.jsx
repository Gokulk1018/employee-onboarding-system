import React, { useState, useEffect } from 'react';
import { Row, Col, theme, Skeleton } from 'antd';
import { HeartOutlined, CommentOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StatCard from '../common/StatCard';
import { getEngagementAnalytics, getRecognitions } from '../../services/engagementService';

const EngagementStats = () => {
    const { token } = theme.useToken();
    const [stats, setStats] = useState(null);
    const [recogCount, setRecogCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, recogRes] = await Promise.all([
                    getEngagementAnalytics(),
                    getRecognitions()
                ]);

                if (analyticsRes.success) {
                    setStats(analyticsRes.data);
                }
                if (recogRes.success) {
                    setRecogCount(recogRes.count || recogRes.data.length);
                }
            } catch (error) {
                console.error('Error fetching engagement stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <Row gutter={[24, 24]}>
                {[1, 2, 3, 4].map(i => (
                    <Col xs={24} sm={12} lg={6} key={i}>
                        <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    </Col>
                ))}
            </Row>
        );
    }

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard
                        title="Sentiment Score"
                        value={stats?.sentiment?.positive || 0}
                        icon={<HeartOutlined />}
                        color={token.colorPrimary}
                        suffix="%"
                    />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard
                        title="Survey Responses"
                        value={stats?.totalResponses || 0}
                        icon={<CommentOutlined />}
                        color={token.colorSuccess}
                    />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard
                        title="Recognitions"
                        value={recogCount}
                        icon={<TrophyOutlined />}
                        color={token.colorWarning}
                    />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard
                        title="Positive Sentiment"
                        value={stats?.sentiment?.positive || 0}
                        suffix="%"
                        icon={<ThunderboltOutlined />}
                        color={token.colorInfo}
                    />
                </motion.div>
            </Col>
        </Row>
    );
};

export default EngagementStats;
