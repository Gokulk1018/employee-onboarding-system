import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Typography, theme, Skeleton } from 'antd';

const data = [
    { name: 'Jan', hired: 4 },
    { name: 'Feb', hired: 3 },
    { name: 'Mar', hired: 6 },
    { name: 'Apr', hired: 8 },
    { name: 'May', hired: 12 },
    { name: 'Jun', hired: 9 },
    { name: 'Jul', hired: 15 },
];

const HiringChart = ({ data = [], loading }) => {
    const { token } = theme.useToken();

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (loading) {
        return (
            <Card
                title={<Typography.Title level={4} style={{ margin: 0 }}>Hiring Trends</Typography.Title>}
                variant="borderless"
                style={{ borderRadius: 20, height: '100%' }}
            >
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    // Generate last 6 months labels
    const getChartData = () => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const monthValue = date.getMonth() + 1; // 1-indexed for MongoDB $month
            const yearValue = date.getFullYear();

            // Find match in backend data
            const match = data.find(item => item._id.month === monthValue && item._id.year === yearValue);
            months.push({
                name: monthName,
                hired: match ? match.count : 0
            });
        }
        return months;
    };

    const chartData = getChartData();

    return (
        <Card
            title={<Typography.Title level={4} style={{ margin: 0 }}>Hiring Trends</Typography.Title>}
            variant="borderless"
            style={{ borderRadius: 20, height: '100%', minHeight: 400 }}
        >
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={token.colorPrimary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={token.colorPrimary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorSplit} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: token.colorTextSecondary }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: token.colorTextSecondary }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: token.boxShadow, backgroundColor: token.colorBgContainer, color: token.colorText }}
                            cursor={{ stroke: token.colorPrimary, strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="hired" stroke={token.colorPrimary} strokeWidth={3} fillOpacity={1} fill="url(#colorHired)" />
                    </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
};

export default HiringChart;
