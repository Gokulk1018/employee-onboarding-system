import dayjs from 'dayjs';

const INITIAL_JOBS = [
    {
        _id: '507f1f77bcf86cd799439011',
        jobTitle: 'Senior Frontend Developer',
        department: 'Engineering',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        location: 'Remote',
        openings: 2,
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
        jobDescription: 'Lead our UI team in building high-performance web applications using modern React patterns.',
        salaryRange: '$120k - $150k',
        applicationDeadline: dayjs().add(15, 'day').toISOString(),
        status: 'OPEN',
        appliedCount: 4
    },
    {
        _id: '507f1f77bcf86cd799439012',
        jobTitle: 'Product Designer',
        department: 'Design',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        location: 'Hybrid',
        openings: 1,
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        jobDescription: 'Design intuitive and beautiful user interfaces for our core HR platform.',
        salaryRange: '$90k - $120k',
        applicationDeadline: dayjs().add(5, 'day').toISOString(),
        status: 'OPEN',
        appliedCount: 4
    },
    {
        _id: '507f1f77bcf86cd799439013',
        jobTitle: 'HR Specialist',
        department: 'Human Resources',
        jobType: 'Contract',
        experienceLevel: 'Junior',
        location: 'Onsite',
        openings: 1,
        skills: ['Recruitment', 'Communication', 'Payroll'],
        jobDescription: 'Support our recruitment efforts and employee engagement initiatives.',
        salaryRange: '$60k - $80k',
        applicationDeadline: dayjs().subtract(2, 'day').toISOString(),
        status: 'CLOSED',
        appliedCount: 4
    },
    {
        _id: '507f1f77bcf86cd799439014',
        jobTitle: 'Backend Architect',
        department: 'Engineering',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        location: 'Remote',
        openings: '1',
        skills: ['Node.js', 'Go', 'Kubernetes', 'Redis'],
        jobDescription: 'Design scalable microservices and manage our global cloud infrastructure.',
        salaryRange: '$150k - $180k',
        applicationDeadline: dayjs().add(25, 'day').toISOString(),
        status: 'OPEN',
        appliedCount: 4
    }
];

const INITIAL_CANDIDATES = {
    '507f1f77bcf86cd799439011': [
        { _id: 'c1', name: 'Alice Smith', email: 'alice@example.com', phone: '123-456-7890', experience: '6 yrs', skills: ['React', 'TS'], stage: 'Applied', resumeUrl: '#', appliedAt: dayjs().subtract(2, 'day').toISOString() },
        { _id: 'c2', name: 'Bob Jones', email: 'bob@example.com', phone: '234-567-8901', experience: '4 yrs', skills: ['Vue', 'D3'], stage: 'Screening', resumeUrl: '#', appliedAt: dayjs().subtract(5, 'day').toISOString() },
        { _id: 'c3', name: 'Charlie Day', email: 'charlie@example.com', phone: '345-678-9012', experience: '7 yrs', skills: ['React', 'Node'], stage: 'Technical Round', resumeUrl: '#', appliedAt: dayjs().subtract(1, 'day').toISOString() },
        { _id: 'c4', name: 'David Lee', email: 'david@example.com', phone: '456-789-0123', experience: '5 yrs', skills: ['Design', 'Next'], stage: 'HR Interview', resumeUrl: '#', appliedAt: dayjs().subtract(7, 'day').toISOString() }
    ],
    '507f1f77bcf86cd799439012': [
        { _id: 'c5', name: 'Eve White', email: 'eve@example.com', phone: '567-890-1234', experience: '3 yrs', skills: ['Figma', 'UI'], stage: 'Applied', resumeUrl: '#', appliedAt: dayjs().subtract(1, 'day').toISOString() },
        { _id: 'c6', name: 'Frank Miller', email: 'frank@example.com', phone: '678-901-2345', experience: '5 yrs', skills: ['UX', 'Research'], stage: 'Screening', resumeUrl: '#', appliedAt: dayjs().subtract(3, 'day').toISOString() },
        { _id: 'c7', name: 'Grace Liu', email: 'grace@example.com', phone: '789-012-3456', experience: '4 yrs', skills: ['Framer', 'SVG'], stage: 'Technical Round', resumeUrl: '#', appliedAt: dayjs().subtract(1, 'hour').toISOString() },
        { _id: 'c8', name: 'Henry Ford', email: 'henry@example.com', phone: '890-123-4567', experience: '2 yrs', skills: ['Adobe XD'], stage: 'Selected', resumeUrl: '#', appliedAt: dayjs().subtract(10, 'day').toISOString() }
    ],
    '507f1f77bcf86cd799439013': [
        { _id: 'c9', name: 'Ivy Chen', email: 'ivy@example.com', phone: '901-234-5678', experience: '1 yr', skills: ['Communication'], stage: 'Selected', resumeUrl: '#', appliedAt: dayjs().subtract(12, 'day').toISOString() },
        { _id: 'c10', name: 'Jack Ross', email: 'jack@example.com', phone: '012-345-6789', experience: '2 yrs', skills: ['Recruitment'], stage: 'Rejected', resumeUrl: '#', appliedAt: dayjs().subtract(8, 'day').toISOString() },
        { _id: 'c11', name: 'Kelly Wu', email: 'kelly@example.com', phone: '123-456-7891', experience: '3 yrs', skills: ['Payroll'], stage: 'Rejected', resumeUrl: '#', appliedAt: dayjs().subtract(5, 'day').toISOString() },
        { _id: 'c12', name: 'Leo Messi', email: 'leo@example.com', phone: '234-567-8902', experience: '10 yrs', skills: ['Leadership'], stage: 'Selected', resumeUrl: '#', appliedAt: dayjs().subtract(2, 'day').toISOString() }
    ],
    '507f1f77bcf86cd799439014': [
        { _id: 'c13', name: 'Mona Lisa', email: 'mona@example.com', phone: '345-678-9013', experience: '8 yrs', skills: ['Go', 'Cloud'], stage: 'Applied', resumeUrl: '#', appliedAt: dayjs().subtract(1, 'day').toISOString() },
        { _id: 'c14', name: 'Nick Fury', email: 'nick@example.com', phone: '456-789-0124', experience: '12 yrs', skills: ['Security'], stage: 'Screening', resumeUrl: '#', appliedAt: dayjs().subtract(4, 'day').toISOString() },
        { _id: 'c15', name: 'Oscar Wilde', email: 'oscar@example.com', phone: '567-890-1235', experience: '5 yrs', skills: ['Node'], stage: 'Technical Round', resumeUrl: '#', appliedAt: dayjs().subtract(2, 'day').toISOString() },
        { _id: 'c16', name: 'Pam Beesly', email: 'pam@example.com', phone: '678-901-2346', experience: '4 yrs', skills: ['Art'], stage: 'HR Interview', resumeUrl: '#', appliedAt: dayjs().subtract(6, 'day').toISOString() }
    ]
};

// PERSISTENCE HELPERS
export const getSessionJobs = () => {
    const saved = localStorage.getItem('demo_jobs');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('demo_jobs', JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
};

export const saveSessionJobs = (jobs) => {
    localStorage.setItem('demo_jobs', JSON.stringify(jobs));
};

export const getSessionCandidates = (jobId) => {
    const saved = localStorage.getItem('demo_candidates');
    const allCandidates = saved ? JSON.parse(saved) : INITIAL_CANDIDATES;

    if (!saved) {
        localStorage.setItem('demo_candidates', JSON.stringify(INITIAL_CANDIDATES));
    }

    return allCandidates[jobId] || [];
};

export const updateSessionCandidates = (jobId, updatedList) => {
    const saved = localStorage.getItem('demo_candidates');
    const allCandidates = saved ? JSON.parse(saved) : { ...INITIAL_CANDIDATES };
    allCandidates[jobId] = updatedList;
    localStorage.setItem('demo_candidates', JSON.stringify(allCandidates));
};

// Static exports for backward compatibility (initial load)
export const mockJobs = getSessionJobs();
export const mockCandidates = INITIAL_CANDIDATES; // Still used for initialization mapping
