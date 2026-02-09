import React from 'react';
import { Typography, Table, Tag, Button, theme } from 'antd';
import { CreditCardOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const invoices = [
    { key: '1', date: 'Oct 01, 2023', amount: '$29.00', status: 'Paid' },
    { key: '2', date: 'Sep 01, 2023', amount: '$29.00', status: 'Paid' },
    { key: '3', date: 'Aug 01, 2023', amount: '$29.00', status: 'Paid' },
];

const BillingSettings = () => {
    const { token } = theme.useToken();
    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date', render: text => <span style={{ color: token.colorTextSecondary }}>{text}</span> },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: text => <span style={{ color: token.colorText, fontWeight: 500 }}>{text}</span> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Tag color="success">Paid</Tag> },
        { title: 'Invoice', key: 'action', render: () => <Button type="text" icon={<DownloadOutlined />} size="small" /> },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, borderColor: token.colorBorder }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>Billing & Plans</Title>

            <div className="flex-between" style={{ padding: 16, background: token.colorBgLayout, borderRadius: 12, marginBottom: 24, border: `1px solid ${token.colorBorder}` }}>
                <div>
                    <Text strong style={{ color: token.colorText, display: 'block' }}>Pro Plan</Text>
                    <Text style={{ color: token.colorTextSecondary }}>$29/month • Billed monthly</Text>
                </div>
                <Button>Manage Plan</Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <CreditCardOutlined style={{ fontSize: 24, color: token.colorText }} />
                <div>
                    <Text strong style={{ color: token.colorText, display: 'block' }}>Visa ending in 4242</Text>
                    <Text style={{ color: token.colorTextSecondary }}>Expires 12/24</Text>
                </div>
                <Button type="link">Update</Button>
            </div>

            <Title level={5} style={{ color: token.colorText, marginBottom: 16 }}>Billing History</Title>
            <Table dataSource={invoices} columns={columns} pagination={false} className="glass-table" size="small" />
        </div>
    );
};

export default BillingSettings;
