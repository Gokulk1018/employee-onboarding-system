import React from 'react';
import { Modal, Button, Space, Typography, message } from 'antd';
import {
    MailOutlined,
    LinkedinOutlined,
    WhatsAppOutlined,
    CopyOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const ShareModal = ({ open, onClose, jobTitle, jobUrl }) => {
    const currentURL = jobUrl || window.location.href;

    const shareOptions = [
        {
            name: 'Email',
            icon: <MailOutlined />,
            color: '#D44638',
            action: () => {
                const subject = encodeURIComponent(`Job Opening: ${jobTitle}`);
                const body = encodeURIComponent(`Check out this job opening: ${jobTitle}\nApply here: ${currentURL}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }
        },
        {
            name: 'LinkedIn',
            icon: <LinkedinOutlined />,
            color: '#0077b5',
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`, '_blank');
            }
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppOutlined />,
            color: '#25D366',
            action: () => {
                const text = encodeURIComponent(`Apply here: ${currentURL}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
            }
        },
        {
            name: 'Unstop',
            icon: <GlobalOutlined />,
            color: '#1A237E',
            action: () => {
                // Placeholder for Unstop sharing logic if specific API exists, 
                // otherwise default to opening their share portal or just copy link
                message.info('Redirecting to Unstop...');
                window.open(`https://unstop.com/`, '_blank');
            }
        },
        {
            name: 'Copy Link',
            icon: <CopyOutlined />,
            color: '#555',
            action: () => {
                navigator.clipboard.writeText(currentURL);
                message.success('Link copied to clipboard!');
            }
        }
    ];

    return (
        <Modal
            title="Share Job Opening"
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
        >
            <div style={{ padding: '20px 0' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Text type="secondary">Share this job with your network:</Text>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {shareOptions.map(option => (
                            <Button
                                key={option.name}
                                type="text"
                                style={{
                                    height: 'auto',
                                    padding: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s'
                                }}
                                onClick={option.action}
                                className="share-button"
                            >
                                <div style={{
                                    fontSize: '24px',
                                    color: option.color,
                                    background: `${option.color}15`,
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px'
                                }}>
                                    {option.icon}
                                </div>
                                <Text size="small" strong>{option.name}</Text>
                            </Button>
                        ))}
                    </div>
                </Space>
            </div>
            <style>
                {`
                    .share-button:hover {
                        background: rgba(0,0,0,0.05) !important;
                        transform: translateY(-2px);
                    }
                `}
            </style>
        </Modal>
    );
};

export default ShareModal;
