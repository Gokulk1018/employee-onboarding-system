const mongoose = require('mongoose');
const Job = require('./models/Job');
const dotenv = require('dotenv');
dotenv.config();

const mockJobs = [
    {
        _id: '65cf1234567890abcdef0001',
        jobTitle: 'Senior Frontend Developer',
        department: 'Engineering',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        location: 'Remote',
        openings: 2,
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
        jobDescription: 'Lead our UI team in building high-performance web applications using modern React patterns.',
        salaryRange: '$120k - $150k',
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'OPEN'
    },
    {
        _id: '65cf1234567890abcdef0002',
        jobTitle: 'Product Designer',
        department: 'Design',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        location: 'Hybrid',
        openings: 1,
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        jobDescription: 'Design intuitive and beautiful user interfaces for our core HR platform.',
        salaryRange: '$90k - $120k',
        applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'OPEN'
    },
    {
        _id: '65cf1234567890abcdef0003',
        jobTitle: 'HR Specialist',
        department: 'Human Resources',
        jobType: 'Contract',
        experienceLevel: 'Junior',
        location: 'Onsite',
        openings: 1,
        skills: ['Recruitment', 'Communication', 'Payroll'],
        jobDescription: 'Support our recruitment efforts and employee engagement initiatives.',
        salaryRange: '$60k - $80k',
        applicationDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'CLOSED'
    },
    {
        _id: '65cf1234567890abcdef0004',
        jobTitle: 'Backend Architect',
        department: 'Engineering',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        location: 'Remote',
        openings: 1,
        skills: ['Node.js', 'Go', 'Kubernetes', 'Redis'],
        jobDescription: 'Design scalable microservices and manage our global cloud infrastructure.',
        salaryRange: '$150k - $180k',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'OPEN'
    }
];

const seed = async () => {
    try {
        const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/employee-onboarding';
        console.log('Connecting to:', connString.split('@')[1] || connString);
        await mongoose.connect(connString);
        console.log('Connected to DB');

        for (const job of mockJobs) {
            await Job.findByIdAndUpdate(job._id, job, { upsert: true, new: true });
            console.log(`Synced job: ${job.jobTitle}`);
        }

        console.log('Sync complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
