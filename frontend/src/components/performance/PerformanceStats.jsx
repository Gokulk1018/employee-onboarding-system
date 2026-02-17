import React, { useState, useEffect } from 'react';
import { Row, Col, theme, Skeleton } from 'antd';
import { StarOutlined, CheckCircleOutlined, SyncOutlined, TrophyOutlined } from '@ant-design/icons';
import StatCard from '../common/StatCard';
import { getPerformanceSummary } from '../../services/performanceService';

const PerformanceStats = () => {
    const { token } = theme.useToken();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // For demo/prototype, we use a fixed ID or get from localStorage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const employeeId = userData?.data?.userId || 'me';

                const res = await getPerformanceSummary(employeeId);
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error('Error fetching performance summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Row gutter={[24, 24]}>
                {[1, 2, 3, 4].map(i => (
                    <Col xs={24} sm={12} lg={6} key={i}>
                        <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    </Col>
                ))}
            </Row>
        );
    }

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Average Rating"
                    value={stats?.averageRating || 0}
                    icon={<StarOutlined />}
                    color={token.colorPrimary}
                    suffix="/ 5"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Goal Completion"
                    value={stats?.goalCompletionPercent || 0}
                    suffix="%"
                    icon={<TrophyOutlined />}
                    color={token.colorInfo}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Reviews Completed"
                    value={stats?.totalReviews || 0}
                    icon={<CheckCircleOutlined />}
                    color={token.colorSuccess}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Pending Reviews"
                    value={stats?.pendingReviews || 0}
                    icon={<SyncOutlined />}
                    color={token.colorWarning}
                />
            </Col>
        </Row>
    );
};

export default PerformanceStats;
