import React from 'react';
import { Table, Tag, Button, theme } from 'antd';
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const PayslipsList = () => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            render: text => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{text}</span>
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            render: text => <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = status === 'Paid' ? 'success' : 'processing';
                let bg = status === 'Paid' ? `rgba(16, 185, 129, 0.1)` : `rgba(59, 130, 246, 0.1)`;
                return (
                    <Tag
                        color={color}
                        bordered={false}
                        style={{ background: bg, borderRadius: 12, fontWeight: 500 }}
                    >
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    ghost
                    size="small"
                >
                    PDF
                </Button>
            )
        },
    ];

    const data = [
        { key: '1', month: 'October 2023', salary: '$5,000', status: 'Paid' },
        { key: '2', month: 'September 2023', salary: '$5,000', status: 'Paid' },
        { key: '3', month: 'August 2023', salary: '$5,000', status: 'Paid' },
        { key: '4', month: 'July 2023', salary: '$5,000', status: 'Paid' },
        { key: '5', month: 'June 2023', salary: '$4,800', status: 'Paid' },
    ];

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Payslip History</div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                className="glass-table"
            />
        </div>
    );
};

export default PayslipsList;
