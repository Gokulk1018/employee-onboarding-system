import React from 'react';
import { Typography, theme, Row, Col, Progress, Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined, AlertOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const TaskOverview = ({ data, loading }) => {
    const { token } = theme.useToken();

    const stats = data?.stats || [];
    const done = stats.find(s => s._id === 'done')?.count || 0;
    const inProgress = stats.find(s => s._id === 'inProgress')?.count || 0;
    const todo = stats.find(s => s._id === 'todo')?.count || 0;
    const total = done + inProgress + todo;
    const overdue = data?.overdue || 0;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div className="glass-card" style={{ height: '100%', padding: 24, borderColor: token.colorBorder }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Task Overview</Title>
                <Tag color="error" icon={<AlertOutlined />}>{overdue} Overdue</Tag>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Progress
                    type="dashboard"
                    percent={completionRate}
                    strokeColor={{
                        '0%': token.colorPrimary,
                        '100%': token.colorSuccess,
                    }}
                    strokeWidth={10}
                    gapDegree={30}
                />
                <div style={{ marginTop: -20 }}>
                    <Text strong style={{ fontSize: 16, color: token.colorText }}>Completion Rate</Text>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: token.colorSuccess, fontSize: 20, marginBottom: 4 }}><CheckCircleOutlined /></div>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{done}</div>
                        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>Done</Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: token.colorInfo, fontSize: 20, marginBottom: 4 }}><SyncOutlined spin={inProgress > 0} /></div>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{inProgress}</div>
                        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>Active</Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: token.colorTextSecondary, fontSize: 20, marginBottom: 4 }}><ClockCircleOutlined /></div>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{todo}</div>
                        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>To Do</Text>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TaskOverview;
