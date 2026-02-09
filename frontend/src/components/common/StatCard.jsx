import React from 'react';
import { Card, theme } from 'antd';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, prefix, suffix, color, trend }) => {
    const { token } = theme.useToken();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Card
                bordered={false}
                bodyStyle={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                style={{ borderRadius: 16, overflow: 'hidden', height: '100%' }}
            >
                <div>
                    <div style={{ color: token.colorTextSecondary, fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{title}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: token.colorTextHeading, lineHeight: 1 }}>
                        {prefix}{value}{suffix}
                    </div>
                    {trend !== undefined && (
                        <div style={{ color: trend > 0 ? token.colorSuccess : token.colorError, fontSize: 13, marginTop: 8, fontWeight: 500 }}>
                            {trend > 0 ? '+' : ''}{trend}% <span style={{ color: token.colorTextTertiary, fontWeight: 400 }}>from last month</span>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: color ? `${color}15` : token.colorPrimaryBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color || token.colorPrimary,
                        fontSize: 24,
                    }}
                >
                    {icon}
                </div>
            </Card>
        </motion.div>
    );
};

export default StatCard;
