import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, Avatar, message } from 'antd';
import axios from 'axios';

const CreateTaskDrawer = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchEmployees();
        }
    }, [open]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/employees`);
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tasks/create`, values);
            if (response.data.success) {
                message.success('Task created successfully');
                form.resetFields();
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Task creation failed:', error);
            message.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Create New Task"
            width={480}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        Create Task
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="Task Name" name="title" rules={[{ required: true, message: 'Please enter task name' }]}>
                    <Input placeholder="e.g. Complete Document Upload" size="large" />
                </Form.Item>
                <Form.Item label="Assignee" name="assignee" rules={[{ required: true, message: 'Please assign to at least one person' }]}>
                    <Select
                        mode="multiple"
                        placeholder="Select assignees..."
                        size="large"
                        optionFilterProp="children"
                    >
                        {employees.map(emp => (
                            <Select.Option key={emp._id} value={emp.name}>
                                <Space>
                                    <Avatar size="small" src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} />
                                    {emp.name}
                                </Space>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Due Date" name="dueDate" rules={[{ required: true, message: 'Please select due date' }]}>
                    <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
                <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
                    <Select placeholder="Select priority" size="large">
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} placeholder="Task details..." />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CreateTaskDrawer;
