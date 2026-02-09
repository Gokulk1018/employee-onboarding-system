import React from 'react';
import { Row, Col, Input, Button, Radio, Space, theme } from 'antd';
import { SearchOutlined, PlusOutlined, AppstoreOutlined, BarsOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';

const EmployeesHeader = ({ viewType, setViewType, onSearch }) => {
    const { token } = theme.useToken();

    return (
        <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col xs={24} md={8}>
                <Input
                    prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="Search employees..."
                    size="large"
                    style={{ borderRadius: 8 }}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </Col>
            <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                <Space>
                    <Button icon={<ImportOutlined />}>Import</Button>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Radio.Group
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="table"><BarsOutlined /></Radio.Button>
                        <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
                    </Radio.Group>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Add Employee
                    </Button>
                </Space>
            </Col>
        </Row>
    );
};

export default EmployeesHeader;
