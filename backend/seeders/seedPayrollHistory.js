const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Employee = require('../models/Employee');
const PayrollProfile = require('../models/PayrollProfile');
const PayrollTransaction = require('../models/PayrollTransaction');
const Payslip = require('../models/Payslip');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const getMonthPattern = (monthIndex) => {
    // Jan is 4500, Feb is 4600, ..., Dec is 5600
    return 4500 + index * 100; // index is 0-based
};

const seedPayroll = async () => {
    try {
        await connectDB();

        const employees = await Employee.find({});
        console.log(`Found ${employees.length} employees to seed.`);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (const employee of employees) {
            console.log(`Processing employee: ${employee.name}`);

            // 1) Ensure PayrollProfile exists
            let profile = await PayrollProfile.findOne({ employeeId: employee._id });
            if (!profile) {
                profile = new PayrollProfile({
                    employeeId: employee._id,
                    baseSalary: 4800,
                    taxPercent: 10,
                    bankName: "Global Bank",
                    accountNumber: `XXXX${Math.floor(1000 + Math.random() * 9000)}`
                });
                await profile.save();
                console.log(`Created profile for ${employee.name}`);
            }

            const taxRate = profile.taxPercent / 100;

            const seedYears = [
                { year: 2024, months: monthNames }, // All 12 months
                { year: 2025, months: ["Jan", "Feb"] }, // Jan, Feb only
                { year: 2026, months: ["Jan", "Feb"] }  // Jan, Feb only
            ];

            for (const yearData of seedYears) {
                for (const month of yearData.months) {
                    let existing = await PayrollTransaction.findOne({
                        employeeId: employee._id,
                        month: month,
                        year: yearData.year
                    });

                    const monthIndex = monthNames.indexOf(month) + 1;

                    if (existing && !existing.monthIndex) {
                        existing.monthIndex = monthIndex;
                        await existing.save();
                        console.log(`Patched monthIndex for ${employee.name} ${month} ${yearData.year}`);
                    }

                    if (!existing) {
                        const monthIndex = monthNames.indexOf(month) + 1;
                        const grossSalary = 4500 + (monthNames.indexOf(month) * 100);
                        const taxAmount = grossSalary * taxRate;
                        const netSalary = grossSalary - taxAmount;

                        const transaction = new PayrollTransaction({
                            employeeId: employee._id,
                            month,
                            year: yearData.year,
                            monthIndex,
                            grossSalary,
                            taxAmount,
                            netSalary,
                            status: 'Paid'
                        });
                        await transaction.save();

                        const payslip = new Payslip({
                            employeeId: employee._id,
                            transactionId: transaction._id,
                            pdfUrl: `/payslips/${employee._id}-${month}-${yearData.year}.pdf`,
                            generatedAt: new Date(yearData.year, monthIndex - 1, 1)
                        });
                        await payslip.save();
                    }
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding payroll data:', error);
        process.exit(1);
    }
};

seedPayroll();
