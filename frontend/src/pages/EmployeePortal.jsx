import React from 'react';
import { Typography, Card, Result, Button, Space } from 'antd';
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const EmployeePortal = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const authKeys = ['isAuthenticated', 'token', 'userRole', 'username', 'candidateName', 'offerId'];
        authKeys.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--ant-color-bg-layout)' }}>
            <Card className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
                <Result
                    icon={<RocketOutlined style={{ color: 'var(--ant-color-primary)', fontSize: 64 }} />}
                    title="Welcome to the Employee Portal"
                    subTitle="You have successfully logged in as an Employee."
                    extra={[
                        <Space key="actions" size="middle">
                            <Button type="primary" size="large">
                                View Profile
                            </Button>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={handleLogout}
                                size="large"
                            >
                                Logout
                            </Button>
                        </Space>
                    ]}
                />
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Title level={4}>Current Available Features</Title>
                    <Paragraph type="secondary">
                        The employee portal is currently under development. <br />
                        As an employee, you will soon be able to manage your tasks, view payroll, and more.
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default EmployeePortal;
