import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Avatar, Space, theme, Typography, Row, Col, Segmented } from 'antd';
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const { Option } = Select;

const MeetingModal = ({ open, onClose, onSubmit, employees = [], loadingEmployees = false }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const selectionMode = Form.useWatch('selectionMode', form);
    const selectedDept = Form.useWatch('department', form);

    const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

    const getAssignees = (values) => {
        if (values.selectionMode === 'all') {
            return employees.map(e => e._id);
        }
        if (values.selectionMode === 'department' && values.department) {
            return employees.filter(e => e.department === values.department).map(e => e._id);
        }
        return values.assignees || [];
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                const { meetingTimes, selectionMode, department, ...rest } = values;
                const assignees = getAssignees(values);

                const taskData = {
                    ...rest,
                    assignees,
                    title: `Team Meeting: ${values.title}`,
                    status: values.status === 'Ended' ? 'done' : 'todo',
                    points: 3, // Reward for participants
                    dueDate: meetingTimes ? meetingTimes[0].toISOString() : undefined,
                    department: values.selectionMode === 'department' ? values.department : 'Corporate',
                    tags: ['team-meeting'],
                    description: `Meeting Agenda: ${values.description || 'No agenda'}\n\nTime: ${meetingTimes ? `${meetingTimes[0].format('HH:mm')} - ${meetingTimes[1].format('HH:mm')}` : 'N/A'}`,
                    isMeeting: true
                };
                onSubmit(taskData);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={<Typography.Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                <TeamOutlined style={{ color: token.colorPrimary }} /> Schedule Team Meeting
            </Typography.Title>}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            width={700}
            destroyOnHidden
            centered
            styles={{ mask: { backdropFilter: 'blur(5px)' } }}
            footer={[
                <Button key="cancel" onClick={onClose} size="large" style={{ borderRadius: 10 }}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} size="large" style={{ borderRadius: 10 }}>
                    Schedule Meeting
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: 'Planned',
                    selectionMode: 'individual'
                }}
                style={{ marginTop: 20 }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label={<span style={{ fontWeight: 600 }}>Meeting Title</span>}
                            rules={[{ required: true, message: 'What is the meeting about?' }]}
                        >
                            <Input placeholder="e.g. Design Sync / Sprint Planning" size="large" style={{ borderRadius: 10 }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label={<span style={{ fontWeight: 600 }}>Agenda & Details</span>}
                >
                    <TextArea rows={4} placeholder="What will be discussed?" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="meetingTimes"
                            label={<span style={{ fontWeight: 600 }}>Schedule (Start & End)</span>}
                            rules={[{ required: true, message: 'Please set the time' }]}
                        >
                            <RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: '100%', borderRadius: 10 }}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label={<span style={{ fontWeight: 600 }}>Initial Status</span>}
                            rules={[{ required: true }]}
                            tooltip="Points are only awarded when status is 'Ended'"
                        >
                            <Select size="large" style={{ borderRadius: 10 }}>
                                <Select.Option value="Planned">Planned</Select.Option>
                                <Select.Option value="Ended">Ended (Immediate Points)</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{
                    padding: 20,
                    background: token.colorFillAlter,
                    borderRadius: 16,
                    border: `1px solid ${token.colorBorder}`,
                    marginBottom: 24
                }}>
                    <Typography.Title level={5} style={{ margin: '0 0 16px 0' }}>Who's Invited?</Typography.Title>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="selectionMode" noStyle>
                                <Segmented
                                    block
                                    size="large"
                                    options={[
                                        { label: 'All Employees', value: 'all' },
                                        { label: 'Department Wise', value: 'department' },
                                        { label: 'Individual Select', value: 'individual' },
                                    ]}
                                    style={{ marginBottom: 20 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {selectionMode === 'department' && (
                        <Form.Item
                            name="department"
                            label="Select Department"
                            rules={[{ required: true, message: 'Please select a department' }]}
                        >
                            <Select placeholder="Select department" size="large" style={{ borderRadius: 10 }}>
                                {departments.map(dept => (
                                    <Option key={dept} value={dept}>{dept}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {selectionMode === 'individual' && (
                        <Form.Item
                            name="assignees"
                            label="Select Participants"
                            rules={[{ required: true, message: 'Select at least one participant' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Invite team members..."
                                size="large"
                                loading={loadingEmployees}
                                style={{ borderRadius: 10 }}
                                optionFilterProp="label"
                            >
                                {employees.map(emp => (
                                    <Option key={emp._id} value={emp._id} label={emp.name}>
                                        <Space>
                                            <Avatar src={emp.avatar} size="small">{emp.name?.charAt(0)}</Avatar>
                                            {emp.name}
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {(selectionMode === 'all' || (selectionMode === 'department' && selectedDept)) && (
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary">
                                {selectionMode === 'all'
                                    ? `Total invited: ${employees.length} employees`
                                    : `Total invited: ${employees.filter(e => e.department === selectedDept).length} employees from ${selectedDept}`}
                            </Text>
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

const Text = Typography.Text;

export default MeetingModal;
