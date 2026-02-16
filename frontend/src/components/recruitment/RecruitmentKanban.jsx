import React from 'react';
import { Typography, Tag, Avatar, Space, theme, Dropdown, Button, Badge } from 'antd';
import { MoreOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

const RecruitmentKanban = ({ candidates, onStageUpdate, jobStatus }) => {
    const { token } = theme.useToken();

    const ALL_STAGES = ['Applied', 'Screening', 'Technical Round', 'HR Interview', 'Selected', 'Rejected'];

    // Visibility Rules
    const visibleStages = jobStatus === 'CLOSED'
        ? ['Selected', 'Rejected']
        : ALL_STAGES;

    const getColumnColor = (stage) => {
        switch (stage) {
            case 'Applied': return '#1677ff';
            case 'Screening': return '#722ed1';
            case 'Technical Round': return '#fa8c16';
            case 'HR Interview': return '#fadb14';
            case 'Selected': return '#52c41a';
            case 'Rejected': return '#f5222d';
            default: return token.colorTextSecondary;
        }
    };

    return (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
            {visibleStages.map((stage) => {
                const stageCandidates = candidates.filter(c => c.stage === stage);
                const color = getColumnColor(stage);

                return (
                    <div key={stage} style={{ minWidth: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                            padding: '8px 12px',
                            background: token.colorBgContainer,
                            borderRadius: 8,
                            borderBottom: `2px solid ${color}`
                        }}>
                            <Text strong style={{ fontSize: 12 }}>{stage}</Text>
                            <Badge
                                count={stageCandidates.length}
                                style={{ backgroundColor: color }}
                                size="small"
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            padding: 4,
                            minHeight: 150
                        }}>
                            {stageCandidates.length > 0 ? (
                                stageCandidates.map((candidate) => (
                                    <div
                                        key={candidate._id}
                                        style={{
                                            padding: 12,
                                            borderRadius: 10,
                                            background: token.colorBgContainer,
                                            border: `1px solid ${token.colorBorderSecondary}`,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div className="flex-between" style={{ marginBottom: 8 }}>
                                            <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.email}`} size="small" />
                                            <Dropdown
                                                menu={{
                                                    items: ALL_STAGES.filter(s => s !== candidate.stage).map(s => ({
                                                        key: s,
                                                        label: `Move to ${s}`,
                                                        onClick: () => onStageUpdate(candidate._id, s)
                                                    }))
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button type="text" icon={<MoreOutlined />} size="small" style={{ opacity: 0.5 }} />
                                            </Dropdown>
                                        </div>
                                        <Text strong style={{ fontSize: 13, display: 'block' }}>{candidate.name}</Text>
                                        <Text type="secondary" style={{ fontSize: 10 }}>{candidate.experience}</Text>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px 0', opacity: 0.4 }}>
                                    <Text style={{ fontSize: 11 }}>No candidates</Text>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RecruitmentKanban;
