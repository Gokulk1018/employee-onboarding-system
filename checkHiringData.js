const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./backend/models/Employee');
const connectDB = require('./backend/config/db');

dotenv.config();

const checkData = async () => {
    await connectDB();
    const employees = await Employee.find();
    console.log(`Total Employees: ${employees.length}`);
    const trends = {};
    employees.forEach(emp => {
        const month = emp.createdAt.getMonth() + 1;
        const year = emp.createdAt.getFullYear();
        const key = `${year}-${month}`;
        trends[key] = (trends[key] || 0) + 1;
    });
    console.log('Hiring Trends (Year-Month):', trends);
    process.exit();
};

checkData();
