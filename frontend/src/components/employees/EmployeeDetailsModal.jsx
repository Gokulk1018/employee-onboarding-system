import React from 'react';
import { Modal, Descriptions, Avatar, Tag, theme, Divider, Space, Typography } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmployeeDetailsModal = ({ open, onClose, employee }) => {
    const { token } = theme.useToken();

    if (!employee) return null;

    const getStatusTag = (status) => {
        let color = 'default';
        if (status === 'Active') color = 'success';
        if (status === 'On Leave') color = 'warning';
        if (status === 'Inactive') color = 'error';
        return <Tag color={color} style={{ borderRadius: 12 }}>{status}</Tag>;
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Employee Profile</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
            className="glass-modal"
            styles={{ mask: { backdropFilter: 'blur(8px)' } }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                    src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.name}&background=random`}
                    size={100}
                    icon={<UserOutlined />}
                    style={{ border: `4px solid ${token.colorPrimary}20`, marginBottom: 16 }}
                />
                <Title level={3} style={{ margin: 0 }}>{employee.name}</Title>
                <Text type="secondary">{employee.role}</Text>
                <div style={{ marginTop: 8 }}>{getStatusTag(employee.status)}</div>
            </div>

            <Divider />

            <Descriptions column={2} bordered size="small">
                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>} span={2}>
                    {employee.email}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><BankOutlined /> Department</Space>}>
                    {employee.department}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined /> Join Date</Space>}>
                    {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><IdcardOutlined /> Role Type</Space>}>
                    {employee.role}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><UserOutlined /> Status</Space>}>
                    {employee.status}
                </Descriptions.Item>
            </Descriptions>

            {employee.onboardingStatus && (
                <>
                    <Divider orientation="left">Onboarding Information</Divider>
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Onboarding Status">
                            <Tag color="processing">{employee.onboardingStatus}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </Modal>
    );
};

export default EmployeeDetailsModal;
