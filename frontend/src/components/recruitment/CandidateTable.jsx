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

            // Guard: mock candidates (m1, m2, c-prefix) cannot be updated via API
            const id = editingCandidate?._id || '';
            if (!id || /^[mc]/.test(id) || id.length !== 24) {
                message.warning('This is a sample/demo candidate and cannot be edited. Only real candidates from the database can be updated.');
                setEditModalOpen(false);
                return;
            }

            setSaving(true);
            const payload = {
                ...values,
                skills: values.skills ? values.skills.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            await api.put(`/candidates/${id}`, payload);
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
            width: 140,
            render: (text, record) => (
                <Space>
                    <Text strong style={{ whiteSpace: 'nowrap' }}>{text}</Text>
                    {record.stage === 'Selected' && <CheckCircleFilled style={{ color: token.colorSuccess }} />}
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            render: text => <Text type="secondary" style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{text}</Text>
        },
        {
            title: 'Exp',
            dataIndex: 'experience',
            key: 'experience',
            width: 70,
            render: text => <Text style={{ whiteSpace: 'nowrap' }}>{text}</Text>
        },
        {
            title: 'Skills',
            dataIndex: 'skills',
            key: 'skills',
            width: 160,
            render: skills => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(skills || []).slice(0, 3).map(skill => (
                        <Tag key={skill} bordered={false} style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>{skill}</Tag>
                    ))}
                    {(skills || []).length > 3 && <Tag bordered={false} style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>+{skills.length - 3}</Tag>}
                </div>
            )
        },
        {
            title: 'Target Role',
            dataIndex: 'targetRole',
            key: 'targetRole',
            width: 160,
            render: (role) => <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600, whiteSpace: 'nowrap' }}>{role || 'Software Engineer'}</Tag>
        },
        {
            title: 'ATS Score',
            dataIndex: 'atsScore',
            key: 'atsScore',
            width: 100,
            align: 'center',
            render: (score) => {
                if (!score) {
                    return <Tag style={{ borderRadius: 8, fontSize: 11, color: '#8c8c8c', borderColor: '#d9d9d9' }}>Pending</Tag>;
                }
                const color = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
                return (
                    <Tag style={{ background: `${color}15`, color: color, borderColor: color, borderRadius: 8, fontWeight: 700, padding: '2px 8px' }}>
                        ⚡ {score}%
                    </Tag>
                );
            }
        },
        {
            title: 'Stage',
            dataIndex: 'stage',
            key: 'stage',
            width: 160,
            render: (stage, record) => (
                <Select
                    value={stage}
                    onChange={(value) => onStageUpdate(record._id, value)}
                    style={{ width: 145 }}
                    size="small"
                >
                    {STAGES.map(s => (
                        <Select.Option key={s} value={s}>{s}</Select.Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Resume',
            key: 'resume',
            width: 90,
            render: (_, record) => {
                const url = record.resumeUrl;
                const isRealUrl = url && url.startsWith('https://') && url !== 'https://drive.google.com' && url !== 'N/A' && url !== '#';
                return isRealUrl ? (
                    <Button type="link" icon={<FileTextOutlined />} size="small" href={url} target="_blank" rel="noopener noreferrer" style={{ padding: 0 }}>
                        PDF
                    </Button>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
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
                        onConfirm={() => {
                            const rid = record._id || '';
                            if (!rid || /^[mc]/.test(rid) || rid.length !== 24) {
                                message.warning('Demo candidates cannot be deleted via API. Use the pipeline controls.');
                                return;
                            }
                            if (onDelete) onDelete(rid);
                        }}
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
                scroll={{ x: 1000 }}
                size="small"
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
