import React from 'react';
import { Typography, Card, Calendar, theme } from 'antd';
import PageContainer from '../components/layout/PageContainer';
import { motion } from 'framer-motion';

const Attendance = () => {
    const { token } = theme.useToken();

    return (
        <PageContainer>
            <div style={{ maxWidth: 1600, margin: '0 auto' }}>
                <div style={{ marginBottom: 24 }}>
                    <Typography.Title level={2} style={{ margin: 0, color: token.colorText }} className="text-gradient">Attendance & Leave</Typography.Title>
                    <div style={{ color: token.colorTextSecondary }}>Manage attendance records and leave requests</div>
                </div>

                <Card variant="borderless" style={{ borderRadius: 16, boxShadow: token.boxShadow }}>
                    <Calendar fullscreen={false} onPanelChange={(value, mode) => console.log(value, mode)} />
                </Card>
            </div>
        </PageContainer>
    );
};
export default Attendance;
