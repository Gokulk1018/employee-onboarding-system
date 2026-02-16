require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const PayrollTransaction = require('../models/PayrollTransaction');

const seedData = [
    { month: "Jan", year: 2025, grossSalary: 5700, taxAmount: 570, netSalary: 5130 },
    { month: "Feb", year: 2025, grossSalary: 5800, taxAmount: 580, netSalary: 5220 },
    { month: "Mar", year: 2025, grossSalary: 5900, taxAmount: 590, netSalary: 5310 },
    { month: "Apr", year: 2025, grossSalary: 6000, taxAmount: 600, netSalary: 5400 },
    { month: "May", year: 2025, grossSalary: 6100, taxAmount: 610, netSalary: 5490 },
    { month: "Jun", year: 2025, grossSalary: 6200, taxAmount: 620, netSalary: 5580 },
    { month: "Jul", year: 2025, grossSalary: 6300, taxAmount: 630, netSalary: 5670 },
    { month: "Aug", year: 2025, grossSalary: 6400, taxAmount: 640, netSalary: 5760 },
    { month: "Sep", year: 2025, grossSalary: 6500, taxAmount: 650, netSalary: 5850 },
    { month: "Oct", year: 2025, grossSalary: 6600, taxAmount: 660, netSalary: 5940 },
    { month: "Nov", year: 2025, grossSalary: 6700, taxAmount: 670, netSalary: 6030 },
    { month: "Dec", year: 2025, grossSalary: 6800, taxAmount: 680, netSalary: 6120 }
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee_onboarding');
        console.log('Connected to MongoDB');

        // Target specifically the employee we worked with before if possible, or fallback
        let employee = await Employee.findById("698abc360e1601d3350e3bf2");
        if (!employee) {
            employee = await Employee.findOne({ employeeId: "job-1-employee" });
        }
        if (!employee) {
            employee = await Employee.findOne();
        }

        if (!employee) {
            console.error('No employee found to seed payroll for.');
            process.exit(1);
        }

        console.log(`Seeding 2025 payroll for: ${employee.name} (${employee._id})`);

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
            console.log(`Inserted payroll for ${record.month} ${record.year}`);
        }

        console.log("\nPayroll 2025 seed inserted successfully");
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
