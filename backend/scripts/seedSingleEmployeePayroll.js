require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const PayrollTransaction = require('../models/PayrollTransaction');

const seedData = [
    // 2024
    { month: "Jan", year: 2024, grossSalary: 4500, taxAmount: 450, netSalary: 4050 },
    { month: "Feb", year: 2024, grossSalary: 4600, taxAmount: 460, netSalary: 4140 },
    { month: "Mar", year: 2024, grossSalary: 4700, taxAmount: 470, netSalary: 4230 },
    { month: "Apr", year: 2024, grossSalary: 4800, taxAmount: 480, netSalary: 4320 },
    { month: "May", year: 2024, grossSalary: 4900, taxAmount: 490, netSalary: 4410 },
    { month: "Jun", year: 2024, grossSalary: 5000, taxAmount: 500, netSalary: 4500 },
    { month: "Jul", year: 2024, grossSalary: 5100, taxAmount: 510, netSalary: 4590 },
    { month: "Aug", year: 2024, grossSalary: 5200, taxAmount: 520, netSalary: 4680 },
    { month: "Sep", year: 2024, grossSalary: 5300, taxAmount: 530, netSalary: 4770 },
    { month: "Oct", year: 2024, grossSalary: 5400, taxAmount: 540, netSalary: 4860 },
    { month: "Nov", year: 2024, grossSalary: 5500, taxAmount: 550, netSalary: 4950 },
    { month: "Dec", year: 2024, grossSalary: 5600, taxAmount: 560, netSalary: 5040 },
    // 2025
    { month: "Jan", year: 2025, grossSalary: 5700, taxAmount: 570, netSalary: 5130 },
    { month: "Feb", year: 2025, grossSalary: 5800, taxAmount: 580, netSalary: 5220 },
    // 2026
    { month: "Jan", year: 2026, grossSalary: 6000, taxAmount: 600, netSalary: 5400 },
    { month: "Feb", year: 2026, grossSalary: 6200, taxAmount: 620, netSalary: 5580 }
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee_onboarding', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB');

        let employee = await Employee.findOne({ employeeId: "job-1-employee" });
        if (!employee) {
            employee = await Employee.findOne();
            console.log(`Target employee "job-1-employee" not found. Using first employee: ${employee ? employee.name : 'None found'}`);
        } else {
            console.log(`Found target employee: ${employee.name}`);
        }

        if (!employee) {
            console.error('No employee found to seed payroll for.');
            process.exit(1);
        }

        for (const record of seedData) {
            const existing = await PayrollTransaction.findOne({
                employeeId: employee._id,
                month: record.month,
                year: record.year
            });

            if (existing) {
                console.log(`Skipping existing record for ${record.month} ${record.year}`);
                continue;
            }

            const monthIndex = monthNames.indexOf(record.month) + 1;

            const transaction = new PayrollTransaction({
                employeeId: employee._id,
                month: record.month,
                year: record.year,
                monthIndex,
                grossSalary: record.grossSalary,
                taxAmount: record.taxAmount,
                netSalary: record.netSalary,
                status: "Paid"
            });

            await transaction.save();
            console.log(`Inserted payroll for ${record.month} ${record.year} for ${employee.name}`);
        }

        console.log("\nPayroll seed inserted successfully");
        const fs = require('fs');
        fs.writeFileSync('FINISHED_SEED.txt', 'Payroll seed inserted successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
