import React, { useState } from 'react';
import { Input, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const HRNotes = () => {
    const { token } = theme.useToken();
    const [notes, setNotes] = useState('Candidate has excellent portfolio. Recommended by senior designer. Start date flexible.');
    const [isSaved, setIsSaved] = useState(true);

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
        setIsSaved(false);
    };

    const handleSave = () => {
        // Frontend-only: Save to local state
        console.log('HR Notes saved:', notes);
        setIsSaved(true);
    };

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: token.colorText }}>Internal HR Notes</span>
                <span style={{
                    fontSize: 12,
                    color: isSaved ? token.colorSuccess : token.colorWarning
                }}>
                    {isSaved ? '✓ Saved' : 'Unsaved changes'}
                </span>
            </div>
            <TextArea
                rows={4}
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleSave}
                placeholder="Add internal notes about the candidate (visible to HR only)..."
                style={{
                    marginBottom: 8,
                    background: token.colorBgContainer,
                    color: token.colorText
                }}
            />
            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                <SaveOutlined /> Auto-saves on blur
            </div>
        </div>
    );
};

export default HRNotes;
