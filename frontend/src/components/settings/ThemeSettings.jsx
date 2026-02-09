import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Switch, Divider, theme } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const ThemeSettings = () => {
    const { token } = theme.useToken();
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [density, setDensity] = useState('comfortable');
    const [mode, setMode] = useState('light');

    const colors = [
        '#4f46e5', // Indigo
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#8b5cf6', // Violet
    ];

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-primary)' }}>Appearance</Title>

            <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: 'var(--text-primary)' }}>Accent Color</Text>
                <Space size={16}>
                    {colors.map(color => (
                        <div
                            key={color}
                            onClick={() => setPrimaryColor(color)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: color,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: primaryColor === color ? `2px solid var(--text-primary)` : 'none',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            {primaryColor === color && <CheckCircleFilled style={{ color: '#fff' }} />}
                        </div>
                    ))}
                </Space>
            </div>

            <Divider style={{ borderColor: 'var(--border-color)' }} />

            <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: 'var(--text-primary)' }}>Interface Density</Text>
                <Radio.Group value={density} onChange={e => setDensity(e.target.value)}>
                    <Radio.Button value="compact">Compact</Radio.Button>
                    <Radio.Button value="comfortable">Comfortable</Radio.Button>
                </Radio.Group>
            </div>

            <Divider style={{ borderColor: 'var(--border-color)' }} />

            <div className="flex-between">
                <div>
                    <Text strong style={{ display: 'block', color: 'var(--text-primary)' }}>Dark Mode</Text>
                    <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Switch between light and dark themes</Text>
                </div>
                <Switch
                    checked={mode === 'dark'}
                    onChange={checked => setMode(checked ? 'dark' : 'light')}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                />
            </div>
        </div>
    );
};

export default ThemeSettings;
