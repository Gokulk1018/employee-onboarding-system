import React from 'react';
import { Typography, Row, Col, Card, Progress, List, Avatar } from 'antd';
import PerformanceStats from '../components/performance/PerformanceStats';
import { motion } from 'framer-motion';

const { Title } = Typography;

const data = [
    { name: 'John Doe', goal: 'Complete Project X', progress: 80 },
    { name: 'Jane Smith', goal: 'Increase sales by 10%', progress: 60 },
    { name: 'Mike Johnson', goal: 'Learn React Native', progress: 30 },
];

const Performance = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: 1600, margin: '0 auto' }}
        >
            <Title level={2}>Performance Management</Title>
            <PerformanceStats />

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Team Goals Progress" bordered={false} style={{ borderRadius: 16 }}>
                        <List
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} />}
                                        title={item.name}
                                        description={item.goal}
                                    />
                                    <div style={{ width: 100 }}>
                                        <Progress percent={item.progress} size="small" />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default Performance;
