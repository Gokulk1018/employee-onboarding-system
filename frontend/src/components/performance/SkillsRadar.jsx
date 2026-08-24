import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Typography, theme, Empty, Spin } from 'antd';
import { getPerformanceSummary } from '../../services/performanceService';

const SkillsRadar = () => {
    const { token } = theme.useToken();
    const [radarData, setRadarData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRadarData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const employeeId = userData?.data?.userId || 'me';
                const res = await getPerformanceSummary(employeeId);

                if (res.success && res.data.radarData) {
                    const formatted = Object.keys(res.data.radarData).map(key => ({
                        subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                        value: res.data.radarData[key],
                        fullMark: 5
                    }));
                    setRadarData(formatted);
                }
            } catch (error) {
                console.error('Error fetching radar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRadarData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: token.colorBgElevated, padding: '8px 12px', border: `1px solid ${token.colorBorder}`, borderRadius: 8 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card" style={{ padding: 24, height: '100%', borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            <Typography.Title level={4} style={{ margin: '0 0 24px 0', color: token.colorText }}>Skills Radar Chart</Typography.Title>

            {loading ? (
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : radarData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke={token.colorBorder} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: token.colorTextSecondary, fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Radar
                                name="Skill Level"
                                dataKey="value"
                                stroke={token.colorPrimary}
                                strokeWidth={2}
                                fill={token.colorPrimary}
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Empty description="No rating data available for radar chart" />
                </div>
            )}
        </div>
    );
};

export default SkillsRadar;
