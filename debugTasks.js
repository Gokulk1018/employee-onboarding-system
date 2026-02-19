const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./backend/models/Task');
const Employee = require('./backend/models/Employee');
const connectDB = require('./backend/config/db');

dotenv.config({ path: './backend/.env' });

const checkTasks = async () => {
    await connectDB();
    const doneTasks = await Task.find({ status: 'done' });
    console.log(`Found ${doneTasks.length} done tasks.`);
    doneTasks.forEach(t => {
        console.log(`- Task: ${t.title}, Points: ${t.points}, Assignees: ${t.assignees}`);
    });

    const employees = await Employee.find({}, 'name _id');
    console.log('\nEmployees list:');
    employees.forEach(e => console.log(`- ${e.name}: ${e._id}`));

    process.exit();
};

checkTasks();
