import React from 'react';
import { Row, Col, theme } from 'antd';
import { StarOutlined, CheckCircleOutlined, SyncOutlined, TrophyOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';

const PerformanceStats = () => {
    const { token } = theme.useToken();
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Average Rating" value={4.2} icon={<StarOutlined />} color={token.colorPrimary} suffix="/5" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Reviews Completed" value={85} suffix="%" icon={<CheckCircleOutlined />} color={token.colorSuccess} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Pending Reviews" value={12} icon={<SyncOutlined />} color={token.colorWarning} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Goal Completion" value={78} suffix="%" icon={<TrophyOutlined />} color={token.colorInfo} />
            </Col>
        </Row>
    );
};

export default PerformanceStats;
