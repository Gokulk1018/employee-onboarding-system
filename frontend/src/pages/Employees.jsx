import React, { useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { UserOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import StatCard from '../components/common/StatCard';
import EmployeesHeader from '../components/employees/EmployeesHeader';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeCardList from '../components/employees/EmployeeCardList';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import { employees as mockEmployees } from '../data/mockData';
import { motion } from 'framer-motion';

const { Title } = Typography;

const Employees = () => {
    const [viewType, setViewType] = useState('table');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = mockEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <Title level={2}>Employee Directory</Title>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <StatCard title="Total Employees" value={mockEmployees.length} icon={<TeamOutlined />} color="#3b82f6" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="Active" value={mockEmployees.filter(e => e.status === 'Active').length} icon={<UserOutlined />} color="#10b981" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="New Joiners" value={2} icon={<UserAddOutlined />} color="#f59e0b" />
                </Col>
            </Row>

            <EmployeesHeader
                viewType={viewType}
                setViewType={setViewType}
                onSearch={setSearchTerm}
            />

            <div style={{ marginTop: 24 }}>
                {viewType === 'table' ? (
                    <EmployeeTable data={filteredData} />
                ) : (
                    <EmployeeCardList data={filteredData} />
                )}
            </div>

            <AddEmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.div>
    );
};

export default Employees;
