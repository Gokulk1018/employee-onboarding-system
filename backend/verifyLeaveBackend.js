const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const connectDB = require('./config/db');

dotenv.config();

const testLeaveFlow = async () => {
    try {
        await connectDB();
        console.log('Database connected');

        // 1. Find an employee
        let employee = await Employee.findOne({ role: 'employee' });
        if (!employee) {
            console.log('No employee found, creating one...');
            employee = await Employee.create({
                name: 'Test Employee',
                email: 'test@example.com',
                department: 'Engineering',
                role: 'employee'
            });
        }
        console.log(`Using employee: ${employee.name} (${employee._id})`);
        console.log('Initial Balance:', employee.leaveBalance);

        // 2. Apply for leave (Annual - 3 days)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 2); // 3 days total (including start and end)

        const leave = await Leave.create({
            employeeId: employee._id,
            leaveType: 'Annual',
            startDate,
            endDate,
            reason: 'Test vacation'
        });
        console.log('Leave request created:', leave._id, 'Status:', leave.status);

        // 3. Approve leave
        leave.status = 'Approved';
        await leave.save();
        console.log('Leave approved');

        // 4. Update balance (Logic from controller)
        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        employee.leaveBalance.annual -= diffDays;
        await employee.save();

        const updatedEmployee = await Employee.findById(employee._id);
        console.log('Updated Balance:', updatedEmployee.leaveBalance);

        // 5. Test Cancel (Pending)
        const cancelLeave = await Leave.create({
            employeeId: employee._id,
            leaveType: 'Sick',
            startDate: new Date(),
            endDate: new Date(),
            reason: 'Short sick leave'
        });
        console.log('Pending leave created for cancel test:', cancelLeave._id);

        await Leave.findByIdAndDelete(cancelLeave._id);
        const findCancelled = await Leave.findById(cancelLeave._id);
        console.log('Leave deleted/cancelled:', !findCancelled);

        console.log('VERIFICATION COMPLETE');
        process.exit(0);
    } catch (err) {
        console.error('Error during verification:', err);
        process.exit(1);
    }
};

testLeaveFlow();
