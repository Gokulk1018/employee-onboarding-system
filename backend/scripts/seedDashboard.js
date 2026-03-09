const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');
const EmployeeRequest = require('../models/EmployeeRequest');
const Offer = require('../models/Offer');
const Document = require('../models/Document');
const PayrollTransaction = require('../models/PayrollTransaction');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

dotenv.config();

const seedDashboardData = async () => {
    try {
        await connectDB();

        // Clear existing data (optional, but good for a clean dashboard)
        // await Employee.deleteMany();
        // await Attendance.deleteMany();
        // await Task.deleteMany();
        // await EmployeeRequest.deleteMany();
        // await Offer.deleteMany();
        // await Document.deleteMany();
        // await PayrollTransaction.deleteMany();
        // await Candidate.deleteMany();

        console.log('Seeding dashboard data...');

        // 1. Seed employees across months for hiring trends
        console.log('Clearing old employees for fresh trend data...');
        await Employee.deleteMany();

        const monthsToSeed = 6;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const staggeredEmployees = [];
        const departments = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'HR', 'UI/UX', 'Tester', 'DevOps'];
        const roles = ['Software Engineer', 'HR Associate', 'Product Designer', 'Frontend Lead', 'Backend Engineer', 'QA Engineer', 'DevOps Specialist'];

        for (let i = 0; i < monthsToSeed; i++) {
            const seedDate = new Date(currentYear, currentMonth - i, 10);
            const hireCount = Math.floor(Math.random() * 5) + 1; // 1-5 hires per month

            for (let j = 0; j < hireCount; j++) {
                staggeredEmployees.push({
                    name: `Employee ${i}_${j}`,
                    email: `emp${i}_${j}@example.com`,
                    department: departments[j % departments.length],
                    role: roles[j % roles.length],
                    status: 'Active',
                    joinDate: seedDate,
                    createdAt: seedDate // Important for aggregation
                });
            }
        }

        employees = await Employee.insertMany(staggeredEmployees);
        console.log(`Seeded ${employees.length} employees across last 6 months`);

        // 2. Seed Attendance for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await Attendance.deleteMany({ date: today });
        const attendanceData = employees.map((emp, index) => ({
            employeeId: emp._id,
            date: today,
            status: index === 3 ? 'Absent' : 'Present' // Make one absent
        }));
        await Attendance.insertMany(attendanceData);
        console.log('Attendance seeded for today');

        // 3. Seed Tasks with difficulty and points
        await Task.deleteMany();
        const tasks = await Task.insertMany([
            { title: 'Fix Header Bug', description: 'Header is overlapping', priority: 'High', status: 'done', difficulty: 'easy', points: 5, assignees: [employees[0]._id], department: 'Fullstack Developer', dueDate: new Date() },
            { title: 'Implement Dashboard', description: 'Data-driven dashboard', priority: 'High', status: 'done', difficulty: 'hard', points: 10, assignees: [employees[0]._id], department: 'Fullstack Developer', dueDate: new Date() },
            { title: 'Update HR Policies', description: 'Policy updates', priority: 'Medium', status: 'done', difficulty: 'medium', points: 7, assignees: [employees[1]._id], department: 'HR', dueDate: new Date() },
            { title: 'Design Layout', description: 'New landing page', priority: 'High', status: 'inProgress', difficulty: 'hard', points: 10, assignees: [employees[2]._id], department: 'UI/UX', dueDate: new Date() },
            { title: 'Review Code', description: 'PR #123', priority: 'Low', status: 'todo', difficulty: 'easy', points: 5, assignees: [employees[3]._id], department: 'Fullstack Developer', dueDate: new Date(today.getTime() - 86400000) } // Overdue
        ]);
        console.log('Tasks seeded');

        // 4. Seed Employee Requests (Leave)
        await EmployeeRequest.deleteMany();
        await EmployeeRequest.insertMany([
            { employeeId: employees[0]._id, name: employees[0].name, email: employees[0].email, department: employees[0].department, requestType: 'Leave Request', message: 'Annual leave', status: 'Pending' },
            { employeeId: employees[2]._id, name: employees[2].name, email: employees[2].email, department: employees[2].department, requestType: 'Personal Query', message: 'Paycheck issue', status: 'Pending' }
        ]);
        console.log('Requests seeded');

        // 5. Seed Offers (Onboardings)
        await Offer.deleteMany();
        await Offer.insertMany([
            { candidateName: 'David Miller', candidateEmail: 'david@example.com', department: 'Fullstack Developer', role: 'Backend Dev', salary: 80000, joiningDate: today, status: 'Accepted', token: 'token1' },
            { candidateName: 'Sarah Connor', candidateEmail: 'sarah@example.com', department: 'Backend Developer', role: 'Sales Lead', salary: 90000, joiningDate: new Date(today.getTime() + 86400000), status: 'Sent', token: 'token2' }
        ]);
        console.log('Offers seeded');

        // 6. Seed Documents (Verification)
        await Document.deleteMany();
        await Document.insertMany([
            { employeeId: employees[0]._id, documentType: 'ID Proof', url: 'http://example.com/id.pdf', status: 'PENDING' }
        ]);
        console.log('Documents seeded');

        // 7. Seed Payroll Transactions (Pending)
        await PayrollTransaction.deleteMany();
        await PayrollTransaction.insertMany([
            { employeeId: employees[0]._id, month: 'February', year: 2026, monthIndex: 1, grossSalary: 5000, taxAmount: 500, netSalary: 4500, status: 'Pending' }
        ]);
        console.log('Payroll seeded');

        // 8. Seed Candidates (Interviews)
        // Need a Job first
        let job = await Job.findOne();
        if (!job) {
            job = await Job.create({ title: 'Fullstack Developer', department: 'Fullstack Developer', type: 'Full-time', level: 'Senior', location: 'Remote', salary: '120k', deadline: new Date(), description: 'Expert dev needed' });
        }
        await Candidate.deleteMany();
        await Candidate.insertMany([
            { name: 'Michael Scott', email: 'michael@example.com', phone: '1234567890', resumeUrl: 'resume.pdf', experience: '10 years', stage: 'HR Interview', jobId: job._id, status: 'PENDING' }
        ]);
        console.log('Candidates seeded');

        console.log('Dashboard seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding dashboard data:', error.message);
        process.exit(1);
    }
};

seedDashboardData();
