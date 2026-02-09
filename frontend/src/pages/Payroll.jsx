import React from 'react';
import { Typography, Row, Col, Button, theme } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import PayrollOverview from '../components/payroll/PayrollOverview';
import PayslipsList from '../components/payroll/PayslipsList';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Payroll = () => {
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
                        <div style={{ color: 'var(--text-secondary)' }}>View your salary details and download payslips</div>
                    </div>
                    <Button icon={<DownloadOutlined />}>Download Report</Button>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <motion.div variants={itemVariants}>
                            <PayrollOverview />
                        </motion.div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <motion.div variants={itemVariants} style={{ height: '100%' }}>
                            <PayslipsList />
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>
        </PageContainer>
    );
};
export default Payroll;
