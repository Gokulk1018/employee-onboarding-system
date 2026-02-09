import React from 'react';
import { Row, Col, theme } from 'antd';
import { TeamOutlined, ScheduleOutlined, DollarOutlined, HeartOutlined, RiseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import StatCard from '../components/common/StatCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import TopPerformers from '../components/dashboard/TopPerformers';

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

const Dashboard = () => {
    const { token } = theme.useToken();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <GreetingBanner />

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Total Employees"
                            value="1,234"
                            icon={<TeamOutlined />}
                            trend={12}
                            color={token.colorInfo}
                        />
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Attendance Rate"
                            value="95"
                            suffix="%"
                            icon={<ScheduleOutlined />}
                            trend={2.5}
                            color={token.colorSuccess}
                        />
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Monthly Payroll"
                            value="450"
                            prefix="$"
                            suffix="k"
                            icon={<DollarOutlined />}
                            trend={-0.4}
                            color={token.colorWarning}
                        />
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Engagement Score"
                            value="8.4"
                            icon={<HeartOutlined />}
                            trend={5.1}
                            color={token.colorPrimary}
                        />
                    </motion.div>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                        <RecentActivities />
                    </motion.div>
                </Col>
                <Col xs={24} lg={8}>
                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                        <TopPerformers />
                    </motion.div>
                </Col>
            </Row>
        </motion.div>
    );
};

export default Dashboard;
