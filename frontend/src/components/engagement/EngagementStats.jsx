import React from 'react';
import { Row, Col, theme } from 'antd';
import { HeartOutlined, CommentOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StatCard from '../common/StatCard';


const EngagementStats = () => {
    const { token } = theme.useToken();

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard title="Engagement Score" value={8.4} icon={<HeartOutlined />} color={token.colorPrimary} suffix="/10" />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard title="Survey Responses" value={92} suffix="%" icon={<CommentOutlined />} color={token.colorSuccess} />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard title="Recognitions" value={35} icon={<TrophyOutlined />} color={token.colorWarning} range="This Week" />
                </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <StatCard title="Active Programs" value={4} icon={<ThunderboltOutlined />} color={token.colorInfo} />
                </motion.div>
            </Col>
        </Row>
    );
};

export default EngagementStats;
