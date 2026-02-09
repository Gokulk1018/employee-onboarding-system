import React from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';

const AddEmployeeModal = ({ open, onClose }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Add New Employee"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            destroyOnClose
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                    <Input placeholder="John Doe" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="john@example.com" />
                </Form.Item>
                <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                    <Select placeholder="Select department">
                        <Select.Option value="Engineering">Engineering</Select.Option>
                        <Select.Option value="Design">Design</Select.Option>
                        <Select.Option value="Product">Product</Select.Option>
                        <Select.Option value="HR">HR</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Join Date" name="joinDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;
