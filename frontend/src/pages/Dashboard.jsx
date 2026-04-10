import React, { useState, useEffect } from 'react';
import { Row, Col, theme, message } from 'antd';
import { TeamOutlined, ScheduleOutlined, DollarOutlined, HeartOutlined, PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import StatCard from '../components/common/StatCard';
import TopPerformers from '../components/dashboard/TopPerformers';
import HiringChart from '../components/dashboard/HiringChart';
import DepartmentChart from '../components/dashboard/DepartmentChart';
import QuickActions from '../components/dashboard/QuickActions';
import PendingApprovals from '../components/dashboard/PendingApprovals';
import TaskOverview from '../components/dashboard/TaskOverview';
import TodayFocus from '../components/dashboard/TodayFocus';
import MeetingModal from '../components/dashboard/MeetingModal';
import LeaveManagementModal from '../components/dashboard/LeaveManagementModal';
import LeaderboardModal from '../components/dashboard/LeaderboardModal';


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
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [isLeaveManagementModalOpen, setIsLeaveManagementModalOpen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [employees, setEmployees] = useState([]);

    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, employeesRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/employees')
            ]);
            if (statsRes.data.success) {
                setData(statsRes.data.data);
            }
            if (employeesRes.data.success) {
                setEmployees(employeesRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            message.error('Failed to load dashboard metrics');
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const response = await api.get('/dashboard/leaderboard');
            if (response.data.success) {
                setLeaderboardData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            message.error('Failed to load full leaderboard');
        } finally {
            setLoadingLeaderboard(false);
        }
    };


    const handleMeetingSubmit = async (meetingData) => {
        try {
            await api.post('/tasks/create', meetingData);
            message.success('Team meeting scheduled successfully');
            setIsMeetingModalOpen(false);
            fetchData(); // Refresh to show new task in overview
        } catch (error) {
            console.error('Error scheduling meeting:', error);
            message.error('Failed to schedule meeting');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                    <GreetingBanner metrics={data?.metrics} />
                </motion.div>

                {/* Stats Grid */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Total Employees"
                                value={data?.metrics?.totalEmployees || 0}
                                icon={<TeamOutlined />}
                                color={token.colorInfo}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Attendance Rate"
                                value={Math.round(data?.metrics?.attendancePercentage || 0)}
                                suffix="%"
                                icon={<ScheduleOutlined />}
                                color={token.colorSuccess}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Pending Tasks"
                                value={data?.metrics?.totalPendingTasks || 0}
                                icon={<ClockCircleOutlined />}
                                color={token.colorWarning}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Active Jobs"
                                value={data?.todayFocus?.activeJobs || 0}
                                icon={<ScheduleOutlined />}
                                color={token.colorPrimary}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                </Row>

                {/* Quick Actions & Hiring Metrics */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <HiringChart data={data?.hiringTrends} loading={loading} />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <QuickActions
                                onMeeting={() => setIsMeetingModalOpen(true)}
                                onLeaveAction={() => setIsLeaveManagementModalOpen(true)}
                            />
                        </motion.div>
                    </Col>

                </Row>

                {/* Department & Activity Section */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <DepartmentChart data={data?.departmentDistribution} loading={loading} />
                                </motion.div>
                            </Col>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <TaskOverview data={data?.taskOverview} loading={loading} />
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={10}>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <PendingApprovals data={data?.pendingApprovals} loading={loading} onRefresh={fetchData} />
                                </motion.div>
                            </Col>
                            <Col span={24}>
                                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                    <TodayFocus data={data?.todayFocus} loading={loading} />
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={6}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <TopPerformers
                                data={data?.topPerformers}
                                loading={loading}
                                onViewAll={() => {
                                    setIsLeaderboardModalOpen(true);
                                    fetchLeaderboard();
                                }}
                            />
                        </motion.div>
                    </Col>
                </Row>

                <MeetingModal
                    open={isMeetingModalOpen}
                    onClose={() => setIsMeetingModalOpen(false)}
                    onSubmit={handleMeetingSubmit}
                    employees={employees}
                    loadingEmployees={loadingEmployees}
                />

                <LeaveManagementModal
                    open={isLeaveManagementModalOpen}
                    onClose={() => setIsLeaveManagementModalOpen(false)}
                    onRefresh={fetchData}
                />

                <LeaderboardModal
                    open={isLeaderboardModalOpen}
                    onClose={() => setIsLeaderboardModalOpen(false)}
                    data={leaderboardData}
                    loading={loadingLeaderboard}
                />
            </motion.div>

        </PageContainer>
    );
};

export default Dashboard;
