import React, { useState } from 'react';
import { Typography, Row, Col, Button, theme, Select, Space, App } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import PayrollOverview from '../components/payroll/PayrollOverview';
import PayslipsList from '../components/payroll/PayslipsList';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title, Text } = Typography;

const Payroll = () => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [selectedYear, setSelectedYear] = useState('2025');

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
                                defaultValue="2025"
                                style={{ width: 100 }}
                                onChange={(value) => setSelectedYear(value)}
                                options={[
                                    { value: '2024', label: '2024' },
                                    { value: '2025', label: '2025' },
                                    { value: '2026', label: '2026' },
                                ]}
                            />
                        </Space>
                        <Button
                            type="primary"
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
                            <PayrollOverview year={selectedYear} />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <PayslipsList year={selectedYear} />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};
export default Payroll;
