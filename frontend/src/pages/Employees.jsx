import React, { useState } from 'react';
import { Row, Col, Typography, theme } from 'antd';
import { UserOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import StatCard from '../components/common/StatCard';
import EmployeesHeader from '../components/employees/EmployeesHeader';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeCardList from '../components/employees/EmployeeCardList';
import DepartmentPieChart from '../components/employees/DepartmentPieChart';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import { employees as mockEmployees } from '../data/mockData';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Employees = () => {
    const { token } = theme.useToken();
    const [viewType, setViewType] = useState('table');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const safeEmployees = mockEmployees || [];

    const filteredData = safeEmployees.filter(emp =>
        (emp?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (emp?.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

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
                <div className="flex-between" style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }} className="text-gradient">Employee Directory</Title>
                    <div style={{ color: 'var(--text-secondary)' }}>
                        Manage and view your team members
                    </div>
                </div>

                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Total Employees"
                                value={safeEmployees.length}
                                icon={<TeamOutlined />}
                                color={token.colorInfo}
                                trend={12}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Active"
                                value={safeEmployees.filter(e => e?.status === 'Active').length}
                                icon={<UserOutlined />}
                                color={token.colorSuccess}
                                trend={5}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="New Joiners"
                                value={2}
                                icon={<UserAddOutlined />}
                                color={token.colorWarning}
                                suffix=" (This Month)"
                            />
                        </motion.div>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
                            <EmployeesHeader
                                viewType={viewType}
                                setViewType={setViewType}
                                onSearch={setSearchTerm}
                                onAdd={() => setIsModalOpen(true)}
                            />

                            <div style={{ marginTop: 24 }}>
                                {viewType === 'table' ? (
                                    <EmployeeTable data={filteredData} />
                                ) : (
                                    <EmployeeCardList data={filteredData} />
                                )}
                            </div>
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants}>
                            <DepartmentPieChart />
                        </motion.div>
                    </Col>
                </Row>

                <AddEmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </motion.div>
        </PageContainer>
    );
};

export default Employees;
