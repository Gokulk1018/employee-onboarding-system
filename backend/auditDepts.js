const mongoose = require('mongoose');
require('dotenv').config();

const audit = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Employee = require('./models/Employee');
        const Job = require('./models/Job');
        const Task = require('./models/Task');
        const Offer = require('./models/Offer');
        const OnboardingUser = require('./models/OnboardingUser');

        const collections = { Employee, Job, Task, Offer, OnboardingUser };
        const results = {};

        for (const [name, Model] of Object.entries(collections)) {
            const stats = await Model.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);
            results[name] = stats;
        }

        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

audit();
