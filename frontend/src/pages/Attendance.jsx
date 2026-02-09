import React from 'react';
import { Typography, Card, Calendar } from 'antd';
import { motion } from 'framer-motion';

const Attendance = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography.Title level={2}>Attendance & Leave</Typography.Title>
            <Card bordered={false} style={{ borderRadius: 16 }}>
                <Calendar />
            </Card>
        </motion.div>
    );
};
export default Attendance;
