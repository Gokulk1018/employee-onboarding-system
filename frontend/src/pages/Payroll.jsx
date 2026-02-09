import React from 'react';
import { Typography, Table, Tag, Card } from 'antd';
import { motion } from 'framer-motion';

const Payroll = () => {
    const columns = [
        { title: 'Month', dataIndex: 'month', key: 'month' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: status => <Tag color="green">{status}</Tag> },
        { title: 'Payslip', key: 'action', render: () => <a>Download</a> },
    ];
    const data = [
        { key: '1', month: 'October 2023', salary: '$5,000', status: 'Paid' },
        { key: '2', month: 'September 2023', salary: '$5,000', status: 'Paid' },
    ];
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography.Title level={2}>Payroll</Typography.Title>
            <Card bordered={false} style={{ borderRadius: 16 }}>
                <Table columns={columns} dataSource={data} />
            </Card>
        </motion.div>
    );
};
export default Payroll;
