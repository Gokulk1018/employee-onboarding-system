import React, { useState } from 'react';
import { Typography, Row, Col, Button, Card, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import OnboardingStepper from '../components/onboarding/OnboardingStepper';
import OfferDrawer from '../components/onboarding/OfferDrawer';
import { motion } from 'framer-motion';

const { Title } = Typography;

const offersData = [
    { key: 1, name: 'Sarah Jenkins', role: 'Senior Designer', status: 'Accepted', date: '2023-11-15' },
    { key: 2, name: 'Tom Wilson', role: 'Frontend Dev', status: 'Sent', date: '2023-11-18' },
    { key: 3, name: 'Amy Lee', role: 'Product Manager', status: 'Draft', date: '2023-11-20' },
];

const Onboarding = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const columns = [
        { title: 'Candidate', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag color={status === 'Accepted' ? 'green' : status === 'Sent' ? 'blue' : 'default'}>
                    {status}
                </Tag>
            )
        },
        { title: 'Date', dataIndex: 'date', key: 'date' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Onboarding & Offers</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Create Offer</Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Recent Offers" bordered={false} style={{ borderRadius: 16 }}>
                        <Table dataSource={offersData} columns={columns} pagination={false} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <OnboardingStepper />
                </Col>
            </Row>

            <OfferDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </motion.div>
    );
};

export default Onboarding;
