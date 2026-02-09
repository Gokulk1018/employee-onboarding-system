import React from 'react';
import { Card, Table, Progress, theme } from 'antd';

const participationData = [
    { key: 1, department: 'Engineering', participation: 92, employees: 45 },
    { key: 2, department: 'Design', participation: 88, employees: 25 },
    { key: 3, department: 'Product', participation: 85, employees: 18 },
    { key: 4, department: 'Marketing', participation: 78, employees: 22 },
    { key: 5, department: 'Sales', participation: 75, employees: 30 },
    { key: 6, department: 'HR', participation: 95, employees: 12 }
];

const ParticipationRate = () => {
    const { token } = theme.useToken();

    const columns = [
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <span style={{ fontWeight: 600, color: token.colorText }}>{text}</span>
        },
        {
            title: 'Participation Rate',
            dataIndex: 'participation',
            key: 'participation',
            render: (rate) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Progress
                        percent={rate}
                        size="small"
                        style={{ flex: 1, maxWidth: 150 }}
                        strokeColor={
                            rate >= 90 ? token.colorSuccess :
                                rate >= 80 ? token.colorPrimary :
                                    rate >= 70 ? token.colorWarning :
                                        token.colorError
                        }
                    />
                    <span style={{ color: token.colorText, fontWeight: 500, minWidth: 40 }}>
                        {rate}%
                    </span>
                </div>
            ),
            sorter: (a, b) => a.participation - b.participation,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Employees',
            dataIndex: 'employees',
            key: 'employees',
            render: (count) => <span style={{ color: token.colorTextSecondary }}>{count}</span>,
            align: 'center'
        }
    ];

    return (
        <Card
            title="Participation Rate by Department"
            bordered={false}
            className="glass-card"
        >
            <Table
                columns={columns}
                dataSource={participationData}
                pagination={false}
                size="small"
                className="glass-table"
            />
        </Card>
    );
};

export default ParticipationRate;
