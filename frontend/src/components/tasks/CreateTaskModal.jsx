import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Button, Row, Col, Upload, Checkbox, InputNumber, theme, message, Avatar, Input, Space } from 'antd';
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CreateTaskModal = ({ open, onClose, onSubmit, editTask = null, employees = [], loadingEmployees = false }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState('');

    // Update subtasks and form fields when editTask or open state changes
    useEffect(() => {
        if (open) {
            if (editTask) {
                setSubtasks(editTask.subtasks || []);
                form.setFieldsValue({
                    ...editTask,
                    dueDate: editTask.dueDate ? dayjs(editTask.dueDate) : undefined,
                    assignees: editTask.assignees?.map(a => a._id || a)
                });
            } else {
                setSubtasks([]);
                form.resetFields();
            }
        }
    }, [editTask, open, form]);

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([...subtasks, { id: `sub-${Date.now()}`, text: newSubtask, completed: false }]);
            setNewSubtask('');
        }
    };

    const handleRemoveSubtask = (id) => {
        setSubtasks(subtasks.filter(st => st.id !== id));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                const taskData = {
                    ...values,
                    dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
                    subtasks,
                    ...(editTask?._id && { _id: editTask._id })
                };
                onSubmit(taskData);
                form.resetFields();
                setSubtasks([]);
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });
    };

    return (
        <Modal
            title={editTask ? 'Edit Task' : 'Create New Task'}
            open={open}
            onCancel={onClose}
            width={800}
            destroyOnHidden
            styles={{ mask: { backdropFilter: 'blur(8px)' } }}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {editTask ? 'Update Task' : 'Create Task'}
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    priority: 'Medium',
                    status: 'To Do'
                }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="Task Name"
                            rules={[{ required: true, message: 'Please enter task name' }]}
                        >
                            <Input placeholder="Enter task name" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <TextArea rows={3} placeholder="Describe the task..." />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="assignees"
                            label="Assignees"
                            rules={[{ required: true, message: 'Please select at least one assignee' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select assignees"
                                size="large"
                                loading={loadingEmployees}
                                optionFilterProp="label"
                            >
                                {employees.map(emp => (
                                    <Select.Option key={emp._id} value={emp._id} label={emp.name}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Avatar src={emp.avatar} size="small">
                                                {emp.name?.charAt(0)}
                                            </Avatar>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{emp.name}</div>
                                                <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{emp.email}</div>
                                            </div>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please select department' }]}
                        >
                            <Select placeholder="Select department" size="large">
                                <Select.Option value="Frontend Developer">Frontend Developer</Select.Option>
                                <Select.Option value="Backend Developer">Backend Developer</Select.Option>
                                <Select.Option value="Fullstack Developer">Fullstack Developer</Select.Option>
                                <Select.Option value="Tester">Tester</Select.Option>
                                <Select.Option value="DevOps">DevOps</Select.Option>
                                <Select.Option value="UI/UX">UI/UX</Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="dueDate"
                            label="Due Date"
                            rules={[{ required: true, message: 'Please select due date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="priority"
                            label="Priority"
                            rules={[{ required: true }]}
                        >
                            <Select size="large">
                                <Select.Option value="Low">Low</Select.Option>
                                <Select.Option value="Medium">Medium</Select.Option>
                                <Select.Option value="High">High</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true }]}
                        >
                            <Select size="large">
                                <Select.Option value="To Do">To Do</Select.Option>
                                <Select.Option value="In Progress">In Progress</Select.Option>
                                <Select.Option value="Done">Done</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="estimatedHours"
                            label="Est. Hours"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="tags"
                            label="Tags"
                        >
                            <Select mode="tags" placeholder="Add tags" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Subtasks">
                            <div style={{ marginBottom: 12 }}>
                                {subtasks.map((subtask) => (
                                    <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <Checkbox checked={subtask.completed} style={{ marginRight: 8 }} />
                                        <span style={{ flex: 1, color: token.colorText }}>{subtask.text}</span>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveSubtask(subtask.id)}
                                            danger
                                        />
                                    </div>
                                ))}
                            </div>
                            <Space.Compact style={{ display: 'flex', width: '100%' }}>
                                <Input
                                    placeholder="Add subtask"
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onPressEnter={handleAddSubtask}
                                    style={{ flex: 1 }}
                                />
                                <Button icon={<PlusOutlined />} onClick={handleAddSubtask}>
                                    Add
                                </Button>
                            </Space.Compact>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateTaskModal;
