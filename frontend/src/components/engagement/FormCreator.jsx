import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, App, Spin } from 'antd';
import { createForm, updateForm } from '../../services/engagementService';
import { getEmployees } from '../../services/employeeService';

const { Option } = Select;

const FormCreator = ({ visible, onCancel, onSuccess, initialData }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [audienceType, setAudienceType] = useState('allEmployees');

    const fetchEmployeesList = async () => {
        try {
            setFetchingEmployees(true);
            const res = await getEmployees();
            if (res.success) {
                setEmployees(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setFetchingEmployees(false);
        }
    };

    React.useEffect(() => {
        if (visible) {
            fetchEmployeesList();
            if (initialData) {
                form.setFieldsValue(initialData);
                setAudienceType(initialData.targetAudience);
            } else {
                form.resetFields();
                setAudienceType('allEmployees');
            }
        }
    }, [visible, initialData, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            let res;
            if (initialData) {
                res = await updateForm(initialData._id, values);
            } else {
                res = await createForm(values);
            }

            if (res.success) {
                message.success(initialData ? 'Form updated successfully' : 'Form created successfully');
                form.resetFields();
                onSuccess();
            }
        } catch (error) {
            message.error(initialData ? 'Failed to update form' : 'Failed to create form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={initialData ? "Edit Engagement Form" : "Create New Form"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                    <Input placeholder="e.g., Annual satisfaction survey" />
                </Form.Item>

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={3} placeholder="Provide details about the form objective..." />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item name="formType" label="Form Type">
                        <Select>
                            <Option value="feedback">Feedback Form</Option>
                            <Option value="survey">Survey (with options)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="category" label="Category">
                        <Select>
                            <Option value="Project Review">Project Review</Option>
                            <Option value="Training Review">Training Review</Option>
                            <Option value="Onboarding Feedback">Onboarding Feedback</Option>
                            <Option value="General Feedback">General Feedback</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item name="targetAudience" label="Target Audience">
                    <Select onChange={(val) => setAudienceType(val)}>
                        <Option value="allEmployees">All Employees</Option>
                        <Option value="department">By Department</Option>
                        <Option value="selectedEmployees">Specific Employees</Option>
                    </Select>
                </Form.Item>

                {audienceType === 'department' && (
                    <Form.Item name="targetDepartment" label="Select Department" rules={[{ required: true }]}>
                        <Select placeholder="Select a department">
                            <Option value="Product">Product</Option>
                            <Option value="Engineering">Engineering</Option>
                            <Option value="HR">HR</Option>
                            <Option value="Marketing">Marketing</Option>
                        </Select>
                    </Form.Item>
                )}

                {/* Searchable multi-select for specific employees */}
                {audienceType === 'selectedEmployees' && (
                    <Form.Item name="targetEmployees" label="Select Employees" rules={[{ required: true, message: 'Please select at least one employee' }]}>
                        <Select
                            mode="multiple"
                            placeholder="Search and select employees"
                            optionFilterProp="children"
                            loading={fetchingEmployees}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={employees.map(emp => ({
                                label: `${emp.name} (${emp.department || 'No Dept'})`,
                                value: emp._id
                            }))}
                            notFoundContent={fetchingEmployees ? <Spin size="small" /> : 'No employees found'}
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default FormCreator;
