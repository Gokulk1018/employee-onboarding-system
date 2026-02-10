const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Employee = require('../models/Employee');

dotenv.config();

const clearData = async () => {
    try {
        await connectDB();

        await Employee.deleteMany();
        console.log('All employees removed successfully');

        process.exit();
    } catch (error) {
        console.error('Error clearing data:', error.message);
        process.exit(1);
    }
};

clearData();
