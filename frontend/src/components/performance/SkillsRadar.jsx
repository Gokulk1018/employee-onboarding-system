import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Typography, theme } from 'antd';

const SkillsRadar = () => {
    const { token } = theme.useToken();

    const data = [
        { subject: 'Communication', A: 120, fullMark: 150 },
        { subject: 'Technical', A: 98, fullMark: 150 },
        { subject: 'Leadership', A: 86, fullMark: 150 },
        { subject: 'Teamwork', A: 99, fullMark: 150 },
        { subject: 'Punctuality', A: 85, fullMark: 150 },
        { subject: 'Problem Solving', A: 65, fullMark: 150 },
    ];

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Team Skills Assessment</Typography.Title>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="var(--border-color)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar
                            name="Team Average"
                            dataKey="A"
                            stroke={token.colorAccent} // Assuming var exists or use token
                            strokeWidth={2}
                            fill={token.colorAccent}
                            fillOpacity={0.3}
                            // Fallback if token.colorAccent not standard, use hex for now or token.colorPrimary
                            style={{ stroke: token.colorPrimary, fill: token.colorPrimary }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SkillsRadar;
