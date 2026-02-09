import React, { useState } from 'react';
import { Card, Input, Button, Space, Radio, Tag, Typography, message, List, Divider, theme } from 'antd';
import { PlusOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SurveyCreator = () => {
    const { token } = theme.useToken();
    const [question, setQuestion] = useState('');
    const [surveyType, setSurveyType] = useState('multiple');
    const [options, setOptions] = useState(['']);
    const [newOption, setNewOption] = useState('');
    const [publishedSurveys, setPublishedSurveys] = useState([
        { id: 1, question: 'How satisfied are you with remote work flexibility?', type: 'multiple', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
        { id: 2, question: 'Would you recommend our company to friends?', type: 'yesno', options: ['Yes', 'No'] }
    ]);

    const handleAddOption = () => {
        if (newOption.trim()) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleRemoveOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handlePublish = () => {
        if (!question.trim()) {
            message.warning('Please enter a survey question');
            return;
        }

        const surveyOptions = surveyType === 'yesno'
            ? ['Yes', 'No']
            : options.filter(opt => opt.trim());

        if (surveyType === 'multiple' && surveyOptions.length < 2) {
            message.warning('Please add at least 2 options');
            return;
        }

        const newSurvey = {
            id: Date.now(),
            question: question.trim(),
            type: surveyType,
            options: surveyOptions
        };

        setPublishedSurveys([newSurvey, ...publishedSurveys]);
        setQuestion('');
        setOptions(['']);
        setSurveyType('multiple');
        message.success('Survey published successfully');
    };

    return (
        <Card
            title="Survey Creator"
            bordered={false}
            className="glass-card"
            style={{ height: '100%' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input
                    placeholder="Enter survey question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    size="large"
                />

                <div>
                    <Text style={{ color: token.colorText, marginBottom: 8, display: 'block' }}>Survey Type:</Text>
                    <Radio.Group value={surveyType} onChange={(e) => setSurveyType(e.target.value)}>
                        <Radio value="multiple">Multiple Choice</Radio>
                        <Radio value="yesno">Yes/No</Radio>
                    </Radio.Group>
                </div>

                {surveyType === 'multiple' && (
                    <div>
                        <Text style={{ color: token.colorText, marginBottom: 8, display: 'block' }}>Options:</Text>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {options.map((option, index) => (
                                <div key={index} style={{ display: 'flex', gap: 8 }}>
                                    <Input
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[index] = e.target.value;
                                            setOptions(newOptions);
                                        }}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    {options.length > 1 && (
                                        <Button
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveOption(index)}
                                            danger
                                        />
                                    )}
                                </div>
                            ))}
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="Add new option"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onPressEnter={handleAddOption}
                                />
                                <Button icon={<PlusOutlined />} onClick={handleAddOption}>
                                    Add Option
                                </Button>
                            </Space.Compact>
                        </Space>
                    </div>
                )}

                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handlePublish}
                    block
                >
                    Publish Survey
                </Button>

                <Divider />

                <div>
                    <Text strong style={{ color: token.colorText }}>Published Surveys</Text>
                    <List
                        style={{ marginTop: 12 }}
                        dataSource={publishedSurveys.slice(0, 2)}
                        renderItem={(item) => (
                            <List.Item style={{ padding: '8px 0' }}>
                                <div style={{ width: '100%' }}>
                                    <Text style={{ color: token.colorText, fontWeight: 500 }}>{item.question}</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag color={item.type === 'yesno' ? 'blue' : 'green'}>
                                            {item.type === 'yesno' ? 'Yes/No' : 'Multiple Choice'}
                                        </Tag>
                                        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                                            {item.options.length} options
                                        </Text>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Space>
        </Card>
    );
};

export default SurveyCreator;
