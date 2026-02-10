const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Employee = require('../models/Employee');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Employee.deleteMany();
        console.log('Existing employees cleared');

        // Sample data
        const sampleEmployee = {
            name: 'Gokul K',
            email: 'gokul@example.com',
            position: 'Senior Developer',
            department: 'Engineering'
        };

        await Employee.create(sampleEmployee);
        console.log('Sample employee created successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error.message);
        process.exit(1);
    }
};

seedData();
