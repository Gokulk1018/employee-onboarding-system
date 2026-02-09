import React from 'react';
import { Row, Col, theme } from 'antd';
import { HeartOutlined, CommentOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';

const EngagementStats = () => {
    const { token } = theme.useToken();
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Engagement Score" value={8.4} icon={<HeartOutlined />} color={token.colorPrimary} suffix="/10" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Survey Responses" value={92} suffix="%" icon={<CommentOutlined />} color={token.colorSuccess} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Recognitions" value={35} icon={<TrophyOutlined />} color={token.colorWarning} range="This Week" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Active Programs" value={4} icon={<ThunderboltOutlined />} color={token.colorInfo} />
            </Col>
        </Row>
    );
};

export default EngagementStats;
