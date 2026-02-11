const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Employee = require('./models/Employee');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkCount = async () => {
    try {
        mongoose.set('debug', true);
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected!');
        const count = await Employee.countDocuments();
        console.log(`Total Employees in DB: ${count}`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCount();
