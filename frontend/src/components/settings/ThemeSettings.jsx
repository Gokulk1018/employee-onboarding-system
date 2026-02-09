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
        <div className="glass-card" style={{ padding: 24, borderColor: token.colorBorder }}>
            <Title level={4} style={{ marginTop: 0, marginBottom: 24, color: token.colorText }}>Appearance</Title>

            <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: token.colorText }}>Accent Color</Text>
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
                                border: primaryColor === color ? `2px solid ${token.colorText}` : 'none',
                                transition: 'all 0.2s',
                                boxShadow: token.boxShadow
                            }}
                        >
                            {primaryColor === color && <CheckCircleFilled style={{ color: '#fff' }} />}
                        </div>
                    ))}
                </Space>
            </div>

            <Divider style={{ borderColor: token.colorBorder }} />

            <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12, color: token.colorText }}>Interface Density</Text>
                <Radio.Group value={density} onChange={e => setDensity(e.target.value)}>
                    <Radio.Button value="compact">Compact</Radio.Button>
                    <Radio.Button value="comfortable">Comfortable</Radio.Button>
                </Radio.Group>
            </div>

            <Divider style={{ borderColor: token.colorBorder }} />

            <div className="flex-between">
                <div>
                    <Text strong style={{ display: 'block', color: token.colorText }}>Dark Mode</Text>
                    <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>Switch between light and dark themes</Text>
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
