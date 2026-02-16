import React from 'react';
import { Row, Col } from 'antd';
import JobCard from './JobCard';

const JobList = ({ jobs, onJobClick }) => {
    return (
        <Row gutter={[24, 24]}>
            {jobs.map(job => (
                <Col xs={24} md={12} lg={8} xl={6} key={job._id}>
                    <JobCard
                        job={job}
                        onClick={() => onJobClick(job._id)}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default JobList;
