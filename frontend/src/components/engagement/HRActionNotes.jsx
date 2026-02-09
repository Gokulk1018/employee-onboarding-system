import React, { useState } from 'react';
import { Card, Input, Typography, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const HRActionNotes = () => {
    const { token } = theme.useToken();
    const [notes, setNotes] = useState('Plan team building event for December. Follow up on low engagement scores in Sales department. Schedule 1-on-1s with new hires.');
    const [isSaved, setIsSaved] = useState(true);

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
        setIsSaved(false);
    };

    const handleSave = () => {
        console.log('HR Action Notes saved:', notes);
        setIsSaved(true);
    };

    return (
        <Card
            title="HR Action Notes"
            bordered={false}
            className="glass-card"
        >
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: token.colorTextSecondary }}>
                    Internal notes for HR team only
                </Text>
                <Text style={{
                    fontSize: 12,
                    color: isSaved ? token.colorSuccess : token.colorWarning
                }}>
                    {isSaved ? '✓ Saved' : 'Unsaved changes'}
                </Text>
            </div>
            <TextArea
                rows={5}
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleSave}
                placeholder="Add action items, follow-ups, or observations about employee engagement..."
                style={{
                    background: token.colorBgContainer,
                    color: token.colorText
                }}
            />
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 8 }}>
                <SaveOutlined /> Auto-saves on blur
            </div>
        </Card>
    );
};

export default HRActionNotes;
