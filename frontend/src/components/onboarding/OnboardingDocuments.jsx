import React, { useState } from 'react';
import { List, Typography, Button, Tag, Upload, Select, theme, message, Space } from 'antd';
import {
    UploadOutlined,
    FilePdfOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    FileImageOutlined,
    EyeOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const initialDocuments = [
    { id: 1, name: 'Signed Offer Letter', status: 'Verified', type: 'pdf', date: 'Nov 20' },
    { id: 2, name: 'ID Proof', status: 'Reviewing', type: 'image', date: 'Nov 21' },
    { id: 3, name: 'Address Proof', status: 'Pending', type: 'pdf', date: '' },
    { id: 4, name: 'Certificates', status: 'Pending', type: 'pdf', date: '', optional: true },
];

const OnboardingDocuments = () => {
    const { token } = theme.useToken();
    const [documents, setDocuments] = useState(initialDocuments);

    const getIcon = (type) => {
        return type === 'pdf' ? <FilePdfOutlined style={{ fontSize: 24, color: '#ef4444' }} /> :
            <FileImageOutlined style={{ fontSize: 24, color: '#3b82f6' }} />;
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'Verified':
                return <Tag icon={<CheckCircleOutlined />} color="success">Verified</Tag>;
            case 'Reviewing':
                return <Tag icon={<SyncOutlined spin />} color="processing">Reviewing</Tag>;
            case 'Pending':
                return <Tag color="warning">Pending</Tag>;
            case 'Rejected':
                return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const handleUpload = (docId) => {
        setDocuments(docs => docs.map(doc =>
            doc.id === docId ? { ...doc, status: 'Reviewing', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) } : doc
        ));
        message.success('Document uploaded successfully');
    };

    const handleView = (docName) => {
        message.info(`Viewing ${docName}`);
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: token.colorText }}>Document Checklist</Title>
                <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Upload New</Button>
                </Upload>
            </div>

            <List
                dataSource={documents}
                renderItem={(item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <List.Item
                            actions={[
                                (item.status === 'Pending' || item.status === 'Rejected') && (
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<UploadOutlined />}
                                        onClick={() => handleUpload(item.id)}
                                    >
                                        Upload
                                    </Button>
                                ),
                                (item.status === 'Verified' || item.status === 'Reviewing') && (
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<EyeOutlined />}
                                        onClick={() => handleView(item.name)}
                                    >
                                        View
                                    </Button>
                                )
                            ].filter(Boolean)}
                            style={{ padding: '12px 0' }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: `${token.colorPrimary}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getIcon(item.type)}
                                    </div>
                                }
                                title={
                                    <Space>
                                        <Text strong style={{ color: token.colorText }}>{item.name}</Text>
                                        {item.optional && <Tag bordered={false} style={{ fontSize: 11 }}>Optional</Tag>}
                                    </Space>
                                }
                                description={
                                    <div style={{ marginTop: 4 }}>
                                        {getStatusTag(item.status)}
                                        {item.date && <Text style={{ fontSize: 12, color: token.colorTextSecondary, marginLeft: 8 }}>{item.date}</Text>}
                                    </div>
                                }
                            />
                        </List.Item>
                    </motion.div>
                )}
            />
        </div>
    );
};

export default OnboardingDocuments;
