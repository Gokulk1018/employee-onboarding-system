import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RecruitmentStats from '../components/recruitment/RecruitmentStats';
import ApplicationList from '../components/recruitment/ApplicationList';
import { motion } from 'framer-motion';

const { Title } = Typography;

const Recruitment = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Recruitment</Title>
                <Button type="primary" icon={<PlusOutlined />} size="large">Post New Job</Button>
            </div>

            <RecruitmentStats />

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <ApplicationList />
                </Col>
            </Row>
        </motion.div>
    );
};

export default Recruitment;
