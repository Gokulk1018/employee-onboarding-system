import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Row, Col, Upload, Checkbox, InputNumber, theme, message } from 'antd';
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CreateTaskModal = ({ open, onClose, onSubmit, editTask = null }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [subtasks, setSubtasks] = useState(editTask?.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([...subtasks, { id: Date.now(), text: newSubtask, completed: false }]);
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
                    subtasks,
                    id: editTask?.id || Date.now(),
                };
                onSubmit(taskData);
                form.resetFields();
                setSubtasks([]);
                message.success(editTask ? 'Task updated successfully' : 'Task created successfully');
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
                initialValues={editTask || {
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
                    <Col span={12}>
                        <Form.Item
                            name="assignee"
                            label="Assignee"
                            rules={[{ required: true, message: 'Please select assignee' }]}
                        >
                            <Select placeholder="Select assignee" size="large">
                                <Select.Option value="John Doe">John Doe</Select.Option>
                                <Select.Option value="Jane Smith">Jane Smith</Select.Option>
                                <Select.Option value="Mike Johnson">Mike Johnson</Select.Option>
                                <Select.Option value="Sarah Williams">Sarah Williams</Select.Option>
                                <Select.Option value="David Brown">David Brown</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please select department' }]}
                        >
                            <Select placeholder="Select department" size="large">
                                <Select.Option value="Engineering">Engineering</Select.Option>
                                <Select.Option value="Design">Design</Select.Option>
                                <Select.Option value="Product">Product</Select.Option>
                                <Select.Option value="Marketing">Marketing</Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="dueDate"
                            label="Due Date"
                            rules={[{ required: true, message: 'Please select due date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="estimatedTime"
                            label="Estimated Time (hours)"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="e.g. 8" />
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
                            name="tags"
                            label="Tags"
                        >
                            <Select mode="tags" placeholder="Add tags" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="attachments"
                            label="Attachments"
                        >
                            <Upload beforeUpload={() => false} maxCount={5}>
                                <Button icon={<UploadOutlined />}>Upload Files</Button>
                            </Upload>
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
                            <Input.Group compact style={{ display: 'flex' }}>
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
                            </Input.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateTaskModal;
