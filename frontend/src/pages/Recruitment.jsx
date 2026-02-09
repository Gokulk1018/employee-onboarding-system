import React, { useState } from 'react';
import { Row, Col, Typography, Button, Segmented, theme } from 'antd';
import { PlusOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import RecruitmentStats from '../components/recruitment/RecruitmentStats';
import ApplicationList from '../components/recruitment/ApplicationList';
import RecruitmentFunnel from '../components/recruitment/RecruitmentFunnel';
import RecruitmentKanban from '../components/recruitment/RecruitmentKanban';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';

const { Title } = Typography;

const Recruitment = () => {
    const { token } = theme.useToken();
    const [viewMode, setViewMode] = useState('kanban');

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
                        <Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">Recruitment</Title>
                        <div style={{ color: token.colorTextSecondary }}>Manage job postings and candidate pipelines</div>
                    </div>
                    <div className="flex-center" style={{ gap: 16 }}>
                        <Segmented
                            options={[
                                { label: 'Kanban', value: 'kanban', icon: <AppstoreOutlined /> },
                                { label: 'List', value: 'list', icon: <UnorderedListOutlined /> },
                            ]}
                            value={viewMode}
                            onChange={setViewMode}
                        />
                        <Button type="primary" icon={<PlusOutlined />} size="large">Post New Job</Button>
                    </div>
                </div>

                <motion.div variants={itemVariants}>
                    <RecruitmentStats />
                </motion.div>

                {viewMode === 'kanban' ? (
                    <motion.div
                        variants={itemVariants}
                        style={{ marginTop: 24 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <RecruitmentKanban />
                    </motion.div>
                ) : (
                    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                        <Col xs={24} lg={16}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <ApplicationList />
                            </motion.div>
                        </Col>
                        <Col xs={24} lg={8}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <RecruitmentFunnel />
                            </motion.div>
                        </Col>
                    </Row>
                )}
            </motion.div>
        </PageContainer>
    );
};

export default Recruitment;
