import React, { useState } from 'react';
import { Button, Drawer, Input, List, Avatar, Typography, theme } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { TextArea } = Input;
const { Text } = Typography;

const AIAssistant = () => {
    const { token } = theme.useToken();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your HR Assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages([...messages, newUserMsg]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const aiMsg = { id: Date.now() + 1, text: "I'm processing your request. This is a demo response.", sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000
                }}
            >
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<RobotOutlined style={{ fontSize: 24 }} />}
                    style={{
                        width: 64,
                        height: 64,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setIsOpen(true)}
                />
            </motion.div>

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<RobotOutlined />} />
                        <div>
                            <Text strong style={{ display: 'block' }}>HR Assistant</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>Always here to help</Text>
                        </div>
                    </div>
                }
                placement="right"
                onClose={() => setIsOpen(false)}
                open={isOpen}
                width={400}
                styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
                closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
            >
                <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: token.colorBgLayout }}>
                    <List
                        dataSource={messages}
                        renderItem={item => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                                    marginBottom: 16
                                }}
                            >
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: 16,
                                    borderBottomRightRadius: item.sender === 'user' ? 4 : 16,
                                    borderBottomLeftRadius: item.sender === 'ai' ? 4 : 16,
                                    background: item.sender === 'user' ? token.colorPrimary : token.colorBgContainer,
                                    color: item.sender === 'user' ? '#fff' : token.colorText,
                                    boxShadow: token.boxShadow,
                                    border: item.sender === 'ai' ? `1px solid ${token.colorBorder}` : 'none'
                                }}>
                                    {item.text}
                                </div>
                            </motion.div>
                        )}
                    />
                </div>
                <div style={{ padding: 16, borderTop: `1px solid ${token.colorBorder}`, background: token.colorBgContainer }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onPressEnter={handleSend}
                            style={{ borderRadius: 20 }}
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default AIAssistant;
