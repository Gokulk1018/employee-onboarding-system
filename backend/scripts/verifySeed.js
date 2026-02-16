require('dotenv').config();
const mongoose = require('mongoose');
const PayrollTransaction = require('../models/PayrollTransaction');
const Employee = require('../models/Employee');
const fs = require('fs');

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee_onboarding');
        const employee = await Employee.findOne({ employeeId: "job-1-employee" }) || await Employee.findOne();
        if (!employee) {
            fs.writeFileSync('verify_result.txt', 'NO_EMPLOYEE');
            process.exit(0);
        }
        const transactions = await PayrollTransaction.find({ employeeId: employee._id });
        if (transactions.length > 0) {
            const t = transactions[0];
            const typeInfo = `Type: ${typeof t.employeeId}, Constructor: ${t.employeeId.constructor.name}, Value: ${t.employeeId}`;
            fs.writeFileSync('verify_result.txt', `COUNT:${transactions.length}\nTYPE:${typeInfo}\nDETAILS:${JSON.stringify(transactions.map(t => ({ m: t.month, y: t.year })))}\nSTATUS:SUCCESS`);
        } else {
            fs.writeFileSync('verify_result.txt', `COUNT:0\nSTATUS:SUCCESS`);
        }
        console.log('Verification file written');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('verify_result.txt', `ERROR:${err.message}`);
        process.exit(1);
    }
}
verify();
