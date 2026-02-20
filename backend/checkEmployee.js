const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'gokulsiva753@gmail.com';
        const employee = await Employee.findOne({ email });

        console.log('--- CHECK EMPLOYEE ---');
        if (employee) {
            console.log('FOUND:', JSON.stringify(employee, null, 2));
        } else {
            console.log('NOT FOUND');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
check();
