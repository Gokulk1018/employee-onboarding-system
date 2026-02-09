import React from 'react';
import { Typography, Row, Col, theme } from 'antd';
import PerformanceStats from '../components/performance/PerformanceStats';
import SkillsRadar from '../components/performance/SkillsRadar';
import PerformanceGoals from '../components/performance/PerformanceGoals';
import PerformanceReviews from '../components/performance/PerformanceReviews';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Performance = () => {
    const { token } = theme.useToken();
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
                    <Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">Performance Management</Title>
                    <div style={{ color: token.colorTextSecondary }}>Track goals, reviews, and skill development</div>
                </div>

                <motion.div variants={itemVariants}>
                    <PerformanceStats />
                </motion.div>

                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <PerformanceGoals />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <PerformanceReviews />
                        </motion.div>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={12}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <SkillsRadar />
                        </motion.div>
                    </Col>
                    {/* Placeholder for future component or leave empty/remove if not needed */}
                </Row>
            </motion.div>
        </PageContainer>
    );
};

export default Performance;
