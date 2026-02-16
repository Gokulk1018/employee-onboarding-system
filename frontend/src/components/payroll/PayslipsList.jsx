import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, theme, Input, Modal, Descriptions, Space, App, Typography } from 'antd';
import { DownloadOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

import axios from 'axios';

const PayslipsList = ({ year, employeeId }) => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                // We use the dashboard API which now returns 'history'
                const res = await axios.get(`http://localhost:5000/api/payroll/dashboard/${employeeId}?year=${year}`);
                setHistory(res.data.history || []);
            } catch (err) {
                console.error('Failed to fetch payslip history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [year, employeeId]);

    const filteredData = history.filter(item =>
        item.month.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleDownload = (e, record) => {
        e.stopPropagation();
        message.success(`Payslip download started for ${record.month}`);
        // In a real app, this would trigger a window.open(record.pdfUrl)
    };

    const showBreakdown = (record) => {
        setSelectedPayslip(record);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: '40%',
            render: text => {
                const parts = text.split(' ');
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: token.colorText, fontSize: 13 }}>{parts[0]}</span>
                        <span style={{ fontSize: 11, color: token.colorTextSecondary, opacity: parts[1] ? 0.7 : 0 }}>{parts[1] || ''}</span>
                    </div>
                );
            }
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            width: '25%',
            render: text => <Text style={{ color: token.colorText, fontWeight: 500, fontSize: 13 }}>{text}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: status => {
                let dotColor = token.colorTextPlaceholder;
                if (status === 'Paid') dotColor = token.colorSuccess;
                else if (status === 'Pending') dotColor = token.colorWarning;
                else if (status === 'Failed') dotColor = token.colorError;

                return (
                    <Space size={8} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: dotColor,
                            boxShadow: `0 0 10px ${dotColor}60`
                        }} />
                        <span style={{ fontSize: 12, color: token.colorTextSecondary, fontWeight: 500 }}>{status}</span>
                    </Space>
                );
            }
        },
        {
            title: '',
            key: 'action',
            width: '15%',
            align: 'right',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<DownloadOutlined style={{ fontSize: 14 }} />}
                    onClick={(e) => handleDownload(e, record)}
                    size="small"
                    style={{ color: token.colorTextSecondary, opacity: 0.6 }}
                />
            )
        },
    ];

    return (
        <div className="glass-card" style={{
            padding: '20px 24px',
            borderColor: token.colorBorder,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
            }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: token.colorText, opacity: 0.9 }}>History</div>
                <Input
                    placeholder="Filter..."
                    variant="borderless"
                    prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder, fontSize: 12 }} />}
                    style={{
                        width: 110,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 8,
                        fontSize: 12,
                        padding: '4px 10px',
                        border: `1px solid ${token.colorBorder}`
                    }}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 6, showSizeChanger: false, size: 'small' }}
                    className="glass-table compact-table"
                    size="small"
                    showHeader={false}
                    loading={loading}
                    locale={{ emptyText: <div style={{ padding: 20, color: token.colorTextSecondary }}>No payslips available</div> }}
                    onRow={(record) => ({
                        onClick: () => showBreakdown(record),
                        style: { cursor: 'pointer' }
                    })}
                />
            </div>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Salary Breakdown</Title>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={(e) => handleDownload(e, selectedPayslip)}
                    >
                        Download PDF
                    </Button>
                ]}
                width={500}
                centered
                styles={{
                    mask: { backdropFilter: 'blur(4px)' },
                    content: { borderRadius: 16 }
                }}
            >
                {selectedPayslip && (
                    <Descriptions
                        bordered
                        column={1}
                        size="small"
                        className="glass-descriptions"
                        labelStyle={{ background: 'rgba(255,255,255,0.02)', fontWeight: 500, color: token.colorTextSecondary }}
                        contentStyle={{ color: token.colorText }}
                    >
                        <Descriptions.Item label="Month">{selectedPayslip.breakdown.month}</Descriptions.Item>
                        <Descriptions.Item label="Basic Pay">{selectedPayslip.breakdown.basicPay}</Descriptions.Item>
                        <Descriptions.Item label="HRA">{selectedPayslip.breakdown.hra}</Descriptions.Item>
                        <Descriptions.Item label="Allowances">{selectedPayslip.breakdown.allowances}</Descriptions.Item>
                        <Descriptions.Item label="Bonus">{selectedPayslip.breakdown.bonus}</Descriptions.Item>
                        <Descriptions.Item label="Tax Deduction" labelStyle={{ color: token.colorError }}>
                            <span style={{ color: token.colorError }}>-{selectedPayslip.breakdown.tax}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Net Salary">
                            <span style={{ color: token.colorSuccess, fontWeight: 700, fontSize: 16 }}>
                                {selectedPayslip.breakdown.net}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default PayslipsList;
