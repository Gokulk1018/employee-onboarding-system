import React from 'react';
import { Typography, Row, Col } from 'antd';
import EngagementStats from '../components/engagement/EngagementStats';
import RecognitionFeed from '../components/engagement/RecognitionFeed';
import PulseSurveys from '../components/engagement/PulseSurveys';
import AnonymousFeedback from '../components/engagement/AnonymousFeedback';
import EngagementTrendChart from '../components/engagement/EngagementTrendChart';
import TopRecognizedEmployees from '../components/engagement/TopRecognizedEmployees';
import SurveyCreator from '../components/engagement/SurveyCreator';
import ParticipationRate from '../components/engagement/ParticipationRate';
import HRActionNotes from '../components/engagement/HRActionNotes';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Engagement = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1600, margin: '0 auto' }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }} className="text-gradient">Employee Engagement</Title>
                    <div style={{ color: 'var(--text-secondary)' }}>Fostering a positive and productive work culture</div>
                </div>

                <motion.div variants={itemVariants}>
                    <EngagementStats />
                </motion.div>

                {/* Engagement Trend Chart - Full Width */}
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24}>
                        <motion.div variants={itemVariants}>
                            <EngagementTrendChart />
                        </motion.div>
                    </Col>
                </Row>

                {/* Main Content Row */}
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={14}>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <RecognitionFeed />
                        </motion.div>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <AnonymousFeedback />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <ParticipationRate />
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={10}>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <PulseSurveys />
                        </motion.div>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <TopRecognizedEmployees />
                        </motion.div>
                        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                            <SurveyCreator />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <HRActionNotes />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};

export default Engagement;
