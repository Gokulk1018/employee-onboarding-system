import React from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, Avatar } from 'antd';

const CreateTaskDrawer = ({ open, onClose }) => {
    return (
        <Drawer
            title="Create New Task"
            width={400}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onClose}>
                        Create
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical">
                <Form.Item label="Task Name" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Task title" />
                </Form.Item>
                <Form.Item label="Assignee" name="assignee">
                    <Select placeholder="Assign to...">
                        <Select.Option value="john"><Avatar size="small" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" /> John Doe</Select.Option>
                        <Select.Option value="jane"><Avatar size="small" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" /> Jane Smith</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Due Date" name="dueDate">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Priority" name="priority">
                    <Select placeholder="Priority">
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CreateTaskDrawer;
