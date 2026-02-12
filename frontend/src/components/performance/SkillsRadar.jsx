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
        <div className="glass-card" style={{ padding: 24, height: '100%', borderColor: token.colorBorder }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Team Skills Assessment</Typography.Title>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke={token.colorBorder} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: token.colorTextSecondary, fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar
                            name="Team Average"
                            dataKey="A"
                            stroke={token.colorPrimary}
                            strokeWidth={2}
                            fill={token.colorPrimary}
                            fillOpacity={0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SkillsRadar;
