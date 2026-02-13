import React from 'react';
import { Row, Col, theme } from 'antd';
import { TeamOutlined, ScheduleOutlined, DollarOutlined, HeartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import StatCard from '../components/common/StatCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import TopPerformers from '../components/dashboard/TopPerformers';
import HiringChart from '../components/dashboard/HiringChart';
import DepartmentChart from '../components/dashboard/DepartmentChart';
import QuickActions from '../components/dashboard/QuickActions';
import TeamMood from '../components/dashboard/TeamMood';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14 }
    }
};

const Dashboard = () => {
    const { token } = theme.useToken();

    return (
        <PageContainer>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: 1600, margin: '0 auto' }}
            >
                {/* Greeting Section */}
                <motion.div variants={itemVariants}>
                    <GreetingBanner />
                </motion.div>

                {/* Stats Grid */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Total Employees"
                                value={1234}
                                icon={<TeamOutlined />}
                                trend={12}
                                color={token.colorInfo}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Attendance Rate"
                                value={95}
                                suffix="%"
                                icon={<ScheduleOutlined />}
                                trend={2.5}
                                color={token.colorSuccess}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Monthly Payroll"
                                value={450}
                                prefix="$"
                                suffix="k"
                                icon={<DollarOutlined />}
                                trend={-0.4}
                                color={token.colorWarning}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Engagement Score"
                                value={8.4}
                                icon={<HeartOutlined />}
                                trend={5.1}
                                color={token.colorPrimary}
                            />
                        </motion.div>
                    </Col>
                </Row>

                {/* Quick Actions & Hiring Metrics */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <HiringChart />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <QuickActions />
                        </motion.div>
                    </Col>
                </Row>

                {/* Department & Activity Section */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <DepartmentChart />
                                </motion.div>
                            </Col>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <TeamMood />
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={10}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <RecentActivities />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <TopPerformers />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};

export default Dashboard;
