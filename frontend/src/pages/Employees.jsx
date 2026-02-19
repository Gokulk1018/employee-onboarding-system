import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, theme, message } from 'antd';
import { UserOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import StatCard from '../components/common/StatCard';
import EmployeesHeader from '../components/employees/EmployeesHeader';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeCardList from '../components/employees/EmployeeCardList';
import DepartmentPieChart from '../components/employees/DepartmentPieChart';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import EmployeeDetailsModal from '../components/employees/EmployeeDetailsModal';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const Employees = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('table');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/employees');
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            message.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();

        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('action') === 'add') {
            setEditingEmployee(null);
            setIsModalOpen(true);
        }
    }, [location]);

    const handleAddSuccess = () => {
        fetchEmployees();
        setEditingEmployee(null);
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('action') === 'add') {
            navigate('/');
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employees/${id}`);
            if (response.data.success) {
                message.success('Employee deleted successfully');
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            message.error('Failed to delete employee');
        }
    };

    const filteredData = employees.filter(emp =>
        (emp?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (emp?.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Calculate dynamic stats
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;

    // New joiners this month
    const now = new Date();
    const newJoiners = employees.filter(e => {
        if (!e.joinDate) return false;
        const joinDate = new Date(e.joinDate);
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;

    // Chart Data Calculation
    const deptCounts = employees.reduce((acc, emp) => {
        const dept = emp.department || 'Other';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(deptCounts).map(dept => ({
        name: dept,
        value: deptCounts[dept]
    }));

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
                                value={totalEmployees}
                                icon={<TeamOutlined />}
                                color={token.colorInfo}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="Active"
                                value={activeEmployees}
                                icon={<UserOutlined />}
                                color={token.colorSuccess}
                                loading={loading}
                            />
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <StatCard
                                title="New Joiners"
                                value={newJoiners}
                                icon={<UserAddOutlined />}
                                color={token.colorWarning}
                                suffix=" (This Month)"
                                loading={loading}
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
                                    <EmployeeTable
                                        data={filteredData}
                                        loading={loading}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                        onView={handleView}
                                    />
                                ) : (
                                    <EmployeeCardList data={filteredData} />
                                )}
                            </div>
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants}>
                            <DepartmentPieChart data={chartData} loading={loading} />
                        </motion.div>
                    </Col>
                </Row>

                <AddEmployeeModal
                    open={isModalOpen}
                    initialData={editingEmployee}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingEmployee(null);
                    }}
                    onSuccess={handleAddSuccess}
                />

                <EmployeeDetailsModal
                    open={isViewModalOpen}
                    employee={selectedEmployee}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedEmployee(null);
                    }}
                />
            </motion.div>
        </PageContainer>
    );
};

export default Employees;
