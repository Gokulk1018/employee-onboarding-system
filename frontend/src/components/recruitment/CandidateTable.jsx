import React, { useState } from 'react';
import { Table, Tag, Select, Button, theme, Space, Typography, Popconfirm, Modal, Form, Input, message } from 'antd';
import { FileTextOutlined, CheckCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Text } = Typography;

const CandidateTable = ({ candidates, onStageUpdate, onDelete, onEdit }) => {
    const { token } = theme.useToken();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

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

    const handleEditOpen = (record) => {
        setEditingCandidate(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            experience: record.experience,
            skills: (record.skills || []).join(', '),
            resumeUrl: record.resumeUrl || ''
        });
        setEditModalOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            const payload = {
                ...values,
                skills: values.skills ? values.skills.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            await api.put(`/candidates/${editingCandidate._id}`, payload);
            message.success('Candidate updated successfully');
            setEditModalOpen(false);
            if (onEdit) onEdit();
        } catch (err) {
            if (err?.response) message.error(err.response.data?.message || 'Failed to update candidate');
        } finally {
            setSaving(false);
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
            title: 'Target Role',
            dataIndex: 'targetRole',
            key: 'targetRole',
            render: (role) => <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600 }}>{role || 'Software Engineer'}</Tag>
        },
        {
            title: 'ATS Score',
            dataIndex: 'atsScore',
            key: 'atsScore',
            render: (score) => {
                if (!score) {
                    return <Tag style={{ borderRadius: 8, fontSize: 11, color: '#8c8c8c', borderColor: '#d9d9d9' }}>Pending</Tag>;
                }
                const color = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
                return (
                    <Tag style={{ background: `${color}15`, color: color, borderColor: color, borderRadius: 8, fontWeight: 700, padding: '2px 8px' }}>
                        ⚡ {score}% ATS
                    </Tag>
                );
            }
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
            render: (_, record) => {
                const url = record.resumeUrl;
                const isRealUrl = url && url.startsWith('https://') && url !== 'https://drive.google.com' && url !== 'N/A' && url !== '#';
                return isRealUrl ? (
                    <Button type="link" icon={<FileTextOutlined />} size="small" href={url} target="_blank" rel="noopener noreferrer">
                        PDF Resume
                    </Button>
                ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>No PDF</Text>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditOpen(record)}
                        style={{ color: token.colorPrimary }}
                    />
                    <Popconfirm
                        title="Delete Candidate?"
                        description="This will permanently remove this candidate."
                        onConfirm={() => onDelete && onDelete(record._id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            style={{ color: '#ef4444' }}
                        />
                    </Popconfirm>
                </Space>
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

            {/* Edit Candidate Modal */}
            <Modal
                title="✏️ Edit Candidate"
                open={editModalOpen}
                onOk={handleEditSave}
                onCancel={() => setEditModalOpen(false)}
                okText="Save Changes"
                confirmLoading={saving}
                width={520}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="experience" label="Experience">
                        <Input placeholder="e.g. 3 Years" />
                    </Form.Item>
                    <Form.Item name="skills" label="Skills (comma separated)">
                        <Input placeholder="e.g. Python, SQL, React" />
                    </Form.Item>
                    <Form.Item name="resumeUrl" label="Resume PDF Link">
                        <Input placeholder="https://drive.google.com/..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CandidateTable;
