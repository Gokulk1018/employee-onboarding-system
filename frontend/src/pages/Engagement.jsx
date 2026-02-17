import React, { useState } from 'react';
import { Typography, Row, Col, theme, Empty, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import FormManager from '../components/engagement/FormManager';
import ActiveForms from '../components/engagement/ActiveForms';
import EngagementInsights from '../components/engagement/EngagementInsights';
import EngagementWall from '../components/engagement/EngagementWall';
import EventCalendar from '../components/engagement/EventCalendar';
import FormAnalytics from '../components/engagement/FormAnalytics';

const { Title, Text } = Typography;

const Engagement = () => {
    const { token } = theme.useToken();
    const userRole = localStorage.getItem('userRole');
    const [selectedForm, setSelectedForm] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);

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

    const handleSelectForm = (form, analytics) => {
        setSelectedForm(form);
        setAnalyticsData(analytics);
    };

    return (
        <PageContainer>
            <div className="mesh-bg-animated" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                opacity: 0.4
            }} />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1700, margin: '0 auto', paddingBottom: 60, paddingTop: 40 }}
            >
                {/* Header & Insights Bar */}
                <div style={{ marginBottom: 40 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: 24 }}
                    >
                        <Title level={1} style={{ margin: 0, fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-1.5px' }} className="text-gradient">
                            Engagement Hub
                        </Title>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <EngagementInsights />
                    </motion.div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Top Section: Form Management and Side Analytics */}
                    <Col span={24}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <motion.div variants={itemVariants}>
                                    {userRole === 'hr' ? (
                                        <FormManager onSelectForm={handleSelectForm} />
                                    ) : (
                                        <ActiveForms />
                                    )}
                                </motion.div>
                            </Col>
                            <Col xs={24} lg={8}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <FormAnalytics
                                        data={analyticsData}
                                        formType={selectedForm?.formType}
                                        formTitle={selectedForm?.title}
                                    />
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>

                    {/* Bottom Section: Wall and Calendar */}
                    <Col span={24}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <motion.div variants={itemVariants}>
                                    <EngagementWall />
                                </motion.div>
                            </Col>
                            <Col xs={24} lg={8}>
                                <motion.div variants={itemVariants}>
                                    <EventCalendar />
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};

export default Engagement;
