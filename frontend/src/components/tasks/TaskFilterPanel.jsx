import React from 'react';
import { Drawer, Select, Button, Space, Divider, Typography, theme } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TaskFilterPanel = ({ open, onClose, filters, onFilterChange, onClearFilters, employees = [] }) => {
    const { token } = theme.useToken();

    // Safety check for employees
    const employeeOptions = Array.isArray(employees) ? employees.map(emp => ({
        label: emp.name,
        value: emp._id
    })) : [];

    return (
        <Drawer
            title={
                <Space>
                    <FilterOutlined />
                    <span>Filter Tasks</span>
                </Space>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={350}
            footer={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button icon={<ClearOutlined />} onClick={onClearFilters}>
                        Clear All
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        Apply Filters
                    </Button>
                </Space>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                        Priority
                    </Text>
                    <Select
                        mode="multiple"
                        placeholder="Select priority"
                        style={{ width: '100%' }}
                        value={filters.priority}
                        onChange={(value) => onFilterChange('priority', value)}
                        options={[
                            { label: 'High', value: 'High' },
                            { label: 'Medium', value: 'Medium' },
                            { label: 'Low', value: 'Low' }
                        ]}
                    />
                </div>

                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                        Assignee
                    </Text>
                    <Select
                        mode="multiple"
                        placeholder="Select assignee"
                        style={{ width: '100%' }}
                        value={filters.assignee}
                        onChange={(value) => onFilterChange('assignee', value)}
                        options={employeeOptions}
                    />
                </div>

                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                        Department
                    </Text>
                    <Select
                        mode="multiple"
                        placeholder="Select department"
                        style={{ width: '100%' }}
                        value={filters.department}
                        onChange={(value) => onFilterChange('department', value)}
                        options={[
                            { label: 'Engineering', value: 'Engineering' },
                            { label: 'Design', value: 'Design' },
                            { label: 'Product', value: 'Product' },
                            { label: 'Marketing', value: 'Marketing' },
                            { label: 'HR', value: 'HR' }
                        ]}
                    />
                </div>

                <Divider />

                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8, color: token.colorText }}>
                        Due Date
                    </Text>
                    <Select
                        placeholder="Select due date filter"
                        style={{ width: '100%' }}
                        value={filters.dueDate}
                        onChange={(value) => onFilterChange('dueDate', value)}
                        allowClear
                        options={[
                            { label: 'Overdue', value: 'overdue' },
                            { label: 'Due Today', value: 'today' },
                            { label: 'Due This Week', value: 'week' },
                            { label: 'Due This Month', value: 'month' }
                        ]}
                    />
                </div>
            </Space>
        </Drawer>
    );
};

export default TaskFilterPanel;
