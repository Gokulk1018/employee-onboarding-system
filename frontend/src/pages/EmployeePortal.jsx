import React, { useState, useEffect } from 'react';
import {
    Typography, Card, Button, Space, Row, Col, Statistic,
    Avatar, Descriptions, Tag, List, Calendar, theme, Progress, Empty, Divider
} from 'antd';
import {
    RocketOutlined, LogoutOutlined, UserOutlined,
    CalendarOutlined, CheckCircleOutlined, BellOutlined,
    SafetyCertificateOutlined, AuditOutlined, TeamOutlined,
    MailOutlined, ProjectOutlined, RiseOutlined, TrophyOutlined, CarryOutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
    ResponsiveContainer, PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const { Title, Text } = Typography;

const EmployeePortal = () => {
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const [employeeData, setEmployeeData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || userId === 'undefined') {
                    setLoading(false);
                    return;
                }

                // Fetch Profile and Stats in parallel
                const [profileRes, statsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/employees/${userId}`),
                    axios.get(`http://localhost:5000/api/employees/me/dashboard/${userId}`)
                ]);

                if (profileRes.data.success) {
                    setEmployeeData(profileRes.data.data);
                }
                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
                // If 404 or 401, session might be invalid
                if (error.response && (error.response.status === 404 || error.response.status === 401)) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    const taskChartData = stats ? [
        { name: 'Completed', value: stats.tasks.completed },
        { name: 'Pending', value: stats.tasks.total - stats.tasks.completed }
    ] : [];

    const CHART_COLORS = [token.colorSuccess, token.colorFillSecondary];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <RocketOutlined spin style={{ fontSize: 48, color: token.colorPrimary }} />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '0px' }}
        >
            {/* Header / Hero Section */}
            <motion.div variants={itemVariants}>
                <Card
                    variant="borderless"
                    className="glass-card"
                    style={{
                        marginBottom: 24,
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                        borderRadius: 24,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Row gutter={24} align="middle">
                        <Col xs={24} md={4} style={{ textAlign: 'center' }}>
                            <Avatar
                                size={120}
                                src={employeeData?.avatar || `https://ui-avatars.com/api/?name=${employeeData?.name}&background=random`}
                                icon={<UserOutlined />}
                                style={{
                                    border: `4px solid ${token.colorBgContainer}`,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Col>
                        <Col xs={24} md={14}>
                            <Space direction="vertical">
                                <Title level={1} style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>
                                    Welcome back, {employeeData?.name}!
                                </Title>
                                <Space wrap>
                                    <Tag color="cyan" style={{ borderRadius: 8, padding: '2px 10px' }}>
                                        <AuditOutlined /> {employeeData?.role}
                                    </Tag>
                                    <Tag color="purple" style={{ borderRadius: 8, padding: '2px 10px' }}>
                                        <TeamOutlined /> {employeeData?.department}
                                    </Tag>
                                    <Tag color="green" style={{ borderRadius: 8, padding: '2px 10px' }}>
                                        <SafetyCertificateOutlined /> {employeeData?.status}
                                    </Tag>
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CarryOutOutlined />}
                                onClick={() => navigate('/employee/leave')}
                                style={{
                                    borderRadius: 12,
                                    height: 50,
                                    padding: '0 24px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            >
                                Apply for Leave
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </motion.div>

            <Row gutter={24}>
                {/* Left Side: Stats & Tasks */}
                <Col xs={24} lg={18}>
                    <Row gutter={[24, 24]}>
                        {/* Task Progress Chart */}
                        <Col xs={24} md={12}>
                            <motion.div variants={itemVariants}>
                                <Card title="Task Completion" className="glass-card" style={{ borderRadius: 20, height: '100%' }}>
                                    <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <PieChart>
                                                <Pie
                                                    data={taskChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {taskChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div style={{ marginTop: -110, textAlign: 'center' }}>
                                            <Title level={2} style={{ margin: 0 }}>{stats?.tasks.completionRate}%</Title>
                                            <Text type="secondary">Completed</Text>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 60, textAlign: 'center' }}>
                                        <Text strong>{stats?.tasks.completed} / {stats?.tasks.total} Tasks Finished</Text>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>

                        {/* Performance & Ranking Hub (Elite Performance) */}
                        <Col xs={24} md={12}>
                            <motion.div variants={itemVariants}>
                                <Card
                                    className="glass-card"
                                    style={{
                                        borderRadius: 24,
                                        height: '100%',
                                        background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(114, 46, 209, 0.08) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        overflow: 'hidden'
                                    }}
                                    styles={{ body: { padding: 24 } }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Title level={4} style={{ margin: 0 }}><TrophyOutlined style={{ color: '#fadb14' }} /> Elite Performance</Title>
                                        <Tag color="gold" style={{ borderRadius: 8, fontWeight: 600 }}>Season 1</Tag>
                                    </div>

                                    <Row gutter={24} align="middle">
                                        <Col span={12}>
                                            <div style={{ textAlign: 'center', padding: '12px 0', background: 'rgba(255,255,255,0.3)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.4)' }}>
                                                <Statistic
                                                    title={<Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Performance Points</Text>}
                                                    value={stats?.performance.points || 0}
                                                    valueStyle={{ fontSize: 36, fontWeight: 900, color: token.colorPrimary, textShadow: '0 2px 10px rgba(24, 144, 255, 0.2)' }}
                                                    suffix="PTS"
                                                />
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ textAlign: 'center', padding: '12px 0', background: 'rgba(24, 144, 255, 0.05)', borderRadius: 20, border: '1px solid rgba(24, 144, 255, 0.1)' }}>
                                                <Statistic
                                                    title={<Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Global Ranking</Text>}
                                                    value={stats?.performance.rank || 'N/A'}
                                                    prefix={<RiseOutlined style={{ color: token.colorSuccess }} />}
                                                    valueStyle={{ fontSize: 36, fontWeight: 900, color: token.colorSuccess }}
                                                    suffix={stats?.performance.rank === 1 ? 'st' : stats?.performance.rank === 2 ? 'nd' : stats?.performance.rank === 3 ? 'rd' : 'th'}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Divider style={{ margin: '24px 0', opacity: 0.5 }} />

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text strong style={{ fontSize: 14 }}>Goal Progress</Text>
                                            <Text type="secondary">{stats?.goals.averageProgress}% Complete</Text>
                                        </div>
                                        <Progress
                                            percent={stats?.goals.averageProgress}
                                            strokeColor={{ '0%': '#1890ff', '100%': '#722ed1' }}
                                            size={[null, 10]}
                                            trailColor="rgba(0,0,0,0.04)"
                                            showInfo={false}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                                            <Button type="link" size="small" style={{ fontSize: 12, color: token.colorTextSecondary }}>View Career Growth ➔</Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>

                        {/* Recent Tasks List */}
                        <Col span={24}>
                            <motion.div variants={itemVariants}>
                                <Card
                                    title={<Space><ProjectOutlined /> My Recent Tasks</Space>}
                                    extra={<Button type="link" onClick={() => navigate('/employee/tasks')}>View All</Button>}
                                    className="glass-card"
                                    style={{ borderRadius: 20 }}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={stats?.tasks.list || []}
                                        locale={{ emptyText: <Empty description="No tasks assigned yet" /> }}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<RocketOutlined />} style={{ backgroundColor: token.colorPrimaryBg }} />}
                                                    title={<Text strong>{item.title}</Text>}
                                                    description={
                                                        <Space split={<Text type="secondary">|</Text>}>
                                                            <Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green'}>
                                                                {item.priority}
                                                            </Tag>
                                                            <Text type="secondary">Due: {dayjs(item.dueDate).format('MMM DD')}</Text>
                                                        </Space>
                                                    }
                                                />
                                                <Tag color={item.status === 'done' ? 'green' : item.status === 'inProgress' ? 'blue' : 'default'}>
                                                    {item.status.toUpperCase()}
                                                </Tag>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </Col>

                {/* Right Side: Profile & Notifications */}
                <Col xs={24} lg={6}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        <motion.div variants={itemVariants}>
                            <Card
                                title={<Space><BellOutlined /> Quick Notifications</Space>}
                                className="glass-card"
                                style={{ borderRadius: 20 }}
                                styles={{ body: { padding: '12px 24px' } }}
                            >                                <List
                                    size="small"
                                    dataSource={stats?.notifications || []}
                                    locale={{ emptyText: <Text type="secondary">No new notifications</Text> }}
                                    renderItem={item => (
                                        <List.Item style={{ padding: '12px 0' }}>
                                            <Space direction="vertical" size={0}>
                                                <Text strong style={{ fontSize: 13 }}>{item.title}</Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{item.message}</Text>
                                                <Text type="secondary" style={{ fontSize: 10 }}>{dayjs(item.createdAt).fromNow()}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card styles={{ body: { padding: 12 } }} className="glass-card" style={{ borderRadius: 20 }}>
                                <Calendar fullscreen={false} />
                            </Card>
                        </motion.div>
                    </Space>
                </Col>
            </Row>
        </motion.div>
    );
};

export default EmployeePortal;
