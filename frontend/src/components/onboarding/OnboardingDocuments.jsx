import React from 'react';
import { List, Typography, Button, Tag, Upload, theme } from 'antd';
import { UploadOutlined, FilePdfOutlined, CheckCircleOutlined, SyncOutlined, FileImageOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const documents = [
    { name: 'Signed Offer Letter', status: 'Verified', type: 'pdf', date: 'Nov 20' },
    { name: 'Identity Proof (Passport)', status: 'Pending', type: 'image', date: 'Nov 21' },
    { name: 'Tax Declaration Form', status: 'Required', type: 'pdf', date: '' },
    { name: 'Previous Employment Relief', status: 'Required', type: 'pdf', date: '' },
];

const OnboardingDocuments = () => {
    const { token } = theme.useToken();

    const getIcon = (type) => {
        return type === 'pdf' ? <FilePdfOutlined style={{ fontSize: 24, color: '#ef4444' }} /> :
            <FileImageOutlined style={{ fontSize: 24, color: '#3b82f6' }} />;
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'Verified': return <Tag icon={<CheckCircleOutlined />} color="success">Verified</Tag>;
            case 'Pending': return <Tag icon={<SyncOutlined spin />} color="processing">Reviewing</Tag>;
            case 'Required': return <Tag color="warning">Action Needed</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Document Checklist</Title>
                <Upload>
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
                                item.status === 'Required' && <Button type="link" size="small">Upload</Button>,
                                item.status === 'Verified' && <Button type="link" size="small">View</Button>
                            ]}
                            style={{ padding: '12px 0' }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: 'var(--bg-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getIcon(item.type)}
                                    </div>
                                }
                                title={<Text strong style={{ color: 'var(--text-primary)' }}>{item.name}</Text>}
                                description={
                                    <div style={{ marginTop: 4 }}>
                                        {getStatusTag(item.status)}
                                        {item.date && <Text style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>{item.date}</Text>}
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
