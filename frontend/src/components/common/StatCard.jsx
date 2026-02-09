import React from 'react';
import { theme, Skeleton } from 'antd';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, prefix, suffix, color, trend, loading }) => {
    const { token } = theme.useToken();

    if (loading) {
        return <Skeleton active paragraph={{ rows: 2 }} className="glass-card p-6" />;
    }

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: `0 10px 20px -5px ${color || token.colorPrimary}40` }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-card"
            style={{
                padding: 24,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                borderColor: 'var(--border-color)',
            }}
        >
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{title}</div>
                <div className="text-gradient" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {prefix}{value}{suffix}
                </div>
                {trend !== undefined && (
                    <div style={{
                        color: trend > 0 ? 'var(--success)' : 'var(--error)',
                        fontSize: 13,
                        marginTop: 8,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>vs last month</span>
                    </div>
                )}
            </div>
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: color ? `${color}15` : `${token.colorPrimary}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color || token.colorPrimary,
                    fontSize: 24,
                    border: `1px solid ${color ? `${color}30` : `${token.colorPrimary}30`}`,
                }}
            >
                {icon}
            </div>
            {/* Background decorative blob */}
            <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                background: color || token.colorPrimary,
                borderRadius: '50%',
                opacity: 0.08,
                filter: 'blur(30px)',
                zIndex: 0
            }} />
        </motion.div>
    );
};

export default StatCard;
