import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, theme, Select, Space, App, Skeleton } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import PayrollOverview from '../components/payroll/PayrollOverview';
import PayslipsList from '../components/payroll/PayslipsList';
import AddPayrollModal from '../components/payroll/AddPayrollModal';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import axios from 'axios';

const { Title, Text } = Typography;

const Payroll = () => {
    const { message } = App.useApp();
    const { token } = theme.useToken();
    const [selectedYear, setSelectedYear] = useState(2025);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchFirstEmployee = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/employees`);
                if (res.data.success && res.data.data.length > 0) {
                    setEmployee(res.data.data[0]);
                }
            } catch (err) {
                console.error('Failed to fetch employees', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFirstEmployee();
    }, []);

    const handleAddSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDownloadReport = () => {
        message.loading('Generating report...', 1.5).then(() => {
            message.success('Payroll report download started');
        });
    };

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
                    <div>
                        <Title level={2} style={{ margin: 0 }} className="text-gradient">Payroll</Title>
                        <div style={{ color: token.colorTextSecondary }}>View your salary details and download payslips</div>
                    </div>
                    <Space size="middle">
                        <Space>
                            <Text type="secondary" style={{ fontSize: 13 }}><FilterOutlined /> Year:</Text>
                            <Select
                                value={String(selectedYear)}
                                style={{ width: 100 }}
                                onChange={(value) => setSelectedYear(Number(value))}
                                options={[
                                    { value: '2024', label: '2024' },
                                    { value: '2025', label: '2025' },
                                    { value: '2026', label: '2026' },
                                ]}
                            />
                        </Space>
                        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                            + Add Payroll Entry
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadReport}
                        >
                            Download Report
                        </Button>
                    </Space>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants}>
                            {!loading && employee ? (
                                <PayrollOverview key={refreshTrigger} year={selectedYear} employeeId={employee._id} />
                            ) : (
                                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Skeleton active />
                                </div>
                            )}
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            {!loading && employee && (
                                <PayslipsList key={refreshTrigger} year={selectedYear} employeeId={employee._id} />
                            )}
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>

            {employee && (
                <AddPayrollModal
                    visible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onSuccess={handleAddSuccess}
                    employeeId={employee._id}
                    preSelectedYear={selectedYear}
                />
            )}
        </PageContainer>
    );
};
export default Payroll;
