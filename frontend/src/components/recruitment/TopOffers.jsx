import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Space, theme, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const { Text } = Typography;

const TopOffers = () => {
    const { token } = theme.useToken();
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                // Return only candidates in OFFER stage
                const response = await axios.get('http://localhost:5000/api/candidates/by-stage/OFFER');
                if (response.data.success) {
                    setOffers(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch top offers:', error);
            }
        };
        fetchOffers();
    }, []);

    if (offers.length === 0) return null;

    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong style={{ fontSize: 18, color: token.colorText }}>Active Offers</Text>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                    paddingBottom: 12,
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // IE/Edge
                }}
                className="hide-scrollbar"
            >
                {offers.map((candidate, index) => (
                    <motion.div
                        key={candidate._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{ minWidth: 280 }}
                    >
                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 16,
                                border: `1px solid ${token.colorBorder}`,
                                background: token.colorBgContainer
                            }}
                            bodyStyle={{ padding: 16 }}
                        >
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                                <Avatar size={48} src={candidate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16, color: token.colorText }}>{candidate.name}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{candidate.roleAppliedFor || 'Candidate'}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 13, color: token.colorTextSecondary }}>
                                    {candidate.resumeUrl ? 'Resume Attached' : 'No Resume'}
                                </div>
                                <Button type="primary" size="small" icon={<SendOutlined />} style={{ borderRadius: 8 }}>
                                    Offer
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <style>
                {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
};

export default TopOffers;
