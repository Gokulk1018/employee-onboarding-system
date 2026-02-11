const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Employee = require('./models/Employee');

dotenv.config();

const testSeed = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Employee.deleteMany({});
        console.log('Cleared existing employees');

        const testEmployees = [
            { name: "John Doe", email: "john@example.com", role: "Developer", department: "Engineering", status: "Active", joinDate: new Date(), avatar: "https://i.pravatar.cc/150?u=john" },
            { name: "Jane Smith", email: "jane@example.com", role: "Designer", department: "Design", status: "Active", joinDate: new Date(), avatar: "https://i.pravatar.cc/150?u=jane" }
        ];

        await Employee.insertMany(testEmployees);
        console.log('Seeded 2 test employees');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testSeed();
