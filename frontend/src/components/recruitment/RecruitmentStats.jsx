import React from 'react';
import { Row, Col, theme } from 'antd';
import { SolutionOutlined, FileSearchOutlined, TeamOutlined, VideoCameraOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';

const RecruitmentStats = () => {
    const { token } = theme.useToken();
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Open Positions" value={12} icon={<SolutionOutlined />} color={token.colorPrimary} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Applications" value={342} icon={<FileSearchOutlined />} color={token.colorInfo} range="This Month" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Interviews" value={45} icon={<VideoCameraOutlined />} color={token.colorWarning} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard title="Offers Extended" value={8} icon={<TeamOutlined />} color={token.colorSuccess} />
            </Col>
        </Row>
    );
};

export default RecruitmentStats;
