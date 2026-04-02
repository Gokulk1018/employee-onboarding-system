import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddPayrollModal = ({ visible, onClose, onSuccess, employeeId, preSelectedYear }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [netSalary, setNetSalary] = useState(0);

    // Initial values
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                year: preSelectedYear || new Date().getFullYear(),
                month: undefined,
                grossSalary: undefined,
                taxAmount: undefined,
                status: 'Paid'
            });
            setNetSalary(0);
        }
    }, [visible, preSelectedYear, form]);

    const handleValuesChange = (_, allValues) => {
        const gross = allValues.grossSalary || 0;
        const tax = allValues.taxAmount || 0;
        setNetSalary(Math.max(0, gross - tax));
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payroll`, {
                ...values,
                employeeId
            });

            message.success('Payroll entry saved successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                message.error('Payroll entry already exists for this month');
            } else {
                message.error('Failed to add payroll entry');
            }
        } finally {
            setLoading(false);
        }
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const years = [2024, 2025, 2026];

    return (
        <Modal
            title="Add Payroll Entry"
            open={visible}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText="Save Entry"
        >
            <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
                <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                    <Select>
                        {years.map(y => <Option key={y} value={y}>{y}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item name="month" label="Month" rules={[{ required: true }]}>
                    <Select placeholder="Select Month">
                        {months.map(m => <Option key={m} value={m}>{m}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item name="grossSalary" label="Gross Salary" rules={[{ required: true, type: 'number', min: 0 }]}>
                    <InputNumber style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                </Form.Item>

                <Form.Item name="taxAmount" label="Tax Amount" rules={[{ required: true, type: 'number', min: 0 }]}>
                    <InputNumber style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                </Form.Item>

                <Form.Item label="Net Salary (Auto-calculated)">
                    <InputNumber style={{ width: '100%' }} value={netSalary} disabled formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Paid">Paid</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Failed">Failed</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPayrollModal;
