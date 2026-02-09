import React from 'react';
import { Row, Col, Card, Avatar, Tag, Button, theme } from 'antd';
import { MailOutlined, PhoneOutlined, MoreOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const EmployeeCardList = ({ data }) => {
    const { token } = theme.useToken();

    return (
        <Row gutter={[24, 24]}>
            {data.map((employee, index) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={employee.id}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card
                            bordered={false}
                            actions={[
                                <MailOutlined key="mail" />,
                                <PhoneOutlined key="phone" />,
                                <MoreOutlined key="more" />,
                            ]}
                            style={{ borderRadius: 16 }}
                        >
                            <Card.Meta
                                avatar={<Avatar src={employee.avatar} size={64} style={{ border: `2px solid ${token.colorBgContainer}` }} />}
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{employee.name}</span>
                                        <Tag color={employee.status === 'Active' ? 'success' : 'default'}>{employee.status}</Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ marginBottom: 4 }}>{employee.role}</div>
                                        <div style={{ fontSize: 12 }}>{employee.department}</div>
                                    </div>
                                }
                            />
                        </Card>
                    </motion.div>
                </Col>
            ))}
        </Row>
    );
};

export default EmployeeCardList;
