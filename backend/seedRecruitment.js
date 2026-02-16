const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const connectDB = require('./config/db');

dotenv.config();

const seedRecruitment = async () => {
    try {
        mongoose.set('debug', true);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Job.deleteMany({});
        await Candidate.deleteMany({});

        console.log('Existing recruitment data cleared...');

        // Create Jobs
        const jobs = await Job.create([
            {
                jobTitle: 'Senior Frontend Developer',
                department: 'Engineering',
                jobType: 'Full-time',
                experienceLevel: 'Senior',
                location: 'Remote',
                openings: 2,
                skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
                jobDescription: 'We are looking for a Senior Frontend Developer to lead our UI team...',
                salaryRange: '120k - 150k',
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'OPEN'
            },
            {
                jobTitle: 'Product Designer',
                department: 'Design',
                jobType: 'Full-time',
                experienceLevel: 'Mid',
                location: 'Hybrid',
                openings: 1,
                skills: ['Figma', 'UI/UX', 'Prototyping'],
                jobDescription: 'Create beautiful and functional designs for our core products...',
                salaryRange: '90k - 110k',
                applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                status: 'OPEN'
            },
            {
                jobTitle: 'HR Specialist',
                department: 'HR',
                jobType: 'Contract',
                experienceLevel: 'Junior',
                location: 'Onsite',
                openings: 1,
                skills: ['Recruitment', 'Communication', 'Payroll'],
                jobDescription: 'Assist in daily HR operations and recruitment processes...',
                salaryRange: '50k - 70k',
                applicationDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (Closed)
                status: 'CLOSED'
            }
        ]);

        console.log(`${jobs.length} jobs seeded!`);

        // Create Candidates for the first job
        const candidates = await Candidate.create([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '123-456-7890',
                resumeUrl: 'https://example.com/alice_resume.pdf',
                skills: ['React', 'CSS', 'JavaScript'],
                experience: '5 years',
                stage: 'Applied',
                jobId: jobs[0]._id,
                status: 'PENDING'
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                phone: '098-765-4321',
                resumeUrl: 'https://example.com/bob_resume.pdf',
                skills: ['Vue', 'Node.js', 'SQL'],
                experience: '3 years',
                stage: 'Screening',
                jobId: jobs[0]._id,
                status: 'PENDING'
            },
            {
                name: 'Charlie Brown',
                email: 'charlie@example.com',
                phone: '555-555-5555',
                resumeUrl: 'https://example.com/charlie_resume.pdf',
                skills: ['React', 'TypeScript'],
                experience: '6 years',
                stage: 'Technical Round',
                jobId: jobs[0]._id,
                status: 'PENDING'
            },
            {
                name: 'Diana Prince',
                email: 'diana@example.com',
                phone: '111-222-3333',
                resumeUrl: 'https://example.com/diana_resume.pdf',
                skills: ['Product Mgmt', 'Strategy'],
                experience: '4 years',
                stage: 'HR Interview',
                jobId: jobs[1]._id,
                status: 'PENDING'
            }
        ]);

        console.log(`${candidates.length} candidates seeded!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding recruitment data:', error);
        process.exit(1);
    }
};

seedRecruitment();
