import React from 'react';
import { Table, Tag, Select, Button, theme, Space, Typography } from 'antd';
import { FileTextOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

const CandidateTable = ({ candidates, onStageUpdate }) => {
    const { token } = theme.useToken();

    const STAGES = ['Applied', 'Screening', 'Technical Round', 'HR Interview', 'Selected', 'Rejected'];

    const getStageColor = (stage) => {
        switch (stage) {
            case 'Applied': return 'blue';
            case 'Screening': return 'orange';
            case 'Technical Round': return 'purple';
            case 'HR Interview': return 'cyan';
            case 'Selected': return 'success';
            case 'Rejected': return 'error';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Text strong>{text}</Text>
                    {record.stage === 'Selected' && <CheckCircleFilled style={{ color: token.colorSuccess }} />}
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: text => <Text type="secondary">{text}</Text>
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: 'Skills',
            dataIndex: 'skills',
            key: 'skills',
            render: skills => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(skills || []).map(skill => (
                        <Tag key={skill} bordered={false} style={{ fontSize: 10, borderRadius: 4 }}>{skill}</Tag>
                    ))}
                </div>
            )
        },
        {
            title: 'Stage',
            dataIndex: 'stage',
            key: 'stage',
            render: (stage, record) => (
                <Select
                    value={stage}
                    onChange={(value) => onStageUpdate(record._id, value)}
                    style={{ width: 150 }}
                    size="small"
                >
                    {STAGES.map(s => (
                        <Select.Option key={s} value={s}>{s}</Select.Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                record.stage === 'Selected' ? (
                    <Tag color="success" style={{ borderRadius: 6, fontWeight: 700 }}>HIRED</Tag>
                ) : (
                    <Tag color={getStageColor(record.stage)} bordered={false}>{record.stage.toUpperCase()}</Tag>
                )
            )
        },
        {
            title: 'Resume',
            key: 'resume',
            render: () => (
                <Button type="link" icon={<FileTextOutlined />} size="small">Link</Button>
            )
        }
    ];

    return (
        <div className="recruitment-table-wrapper">
            <Table
                dataSource={candidates}
                columns={columns}
                rowKey="_id"
                pagination={false}
                className="custom-recruitment-table"
                rowClassName={(record) => record.stage === 'Selected' ? 'hired-row' : ''}
                style={{ marginTop: 20 }}
                onRow={(record) => ({
                    style: {
                        background: record.stage === 'Selected' ? `${token.colorSuccess}08` : 'transparent',
                        transition: 'all 0.3s ease'
                    }
                })}
            />
            <style sx>{`
                .hired-row td:first-child {
                    border-left: 4px solid ${token.colorSuccess} !important;
                }
                .custom-recruitment-table .ant-table-row:hover td {
                    background: ${token.colorFillQuaternary} !important;
                }
            `}</style>
        </div>
    );
};

export default CandidateTable;
