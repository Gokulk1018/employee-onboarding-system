import React from 'react';
import { Typography, Row, Col } from 'antd';
import EngagementStats from '../components/engagement/EngagementStats';
import RecognitionFeed from '../components/engagement/RecognitionFeed';
import { motion } from 'framer-motion';

const { Title } = Typography;

const Engagement = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <Title level={2}>Employee Engagement</Title>
            <EngagementStats />

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <RecognitionFeed />
                </Col>
            </Row>
        </motion.div>
    );
};

export default Engagement;
