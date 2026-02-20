const mongoose = require('mongoose');
const OnboardingUser = require('./models/OnboardingUser');
require('dotenv').config();

const listAll = async () => {
    try {
        console.log('Connecting to', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const users = await OnboardingUser.find({});
        console.log(`Found ${users.length} users`);
        users.forEach(u => {
            console.log(`- Name: ${u.candidateName}, Phone: ${u.candidatePhone}, Address: ${u.candidateAddress}, CreatedAt: ${u.createdAt}`);
            console.log(`  OnboardingData:`, JSON.stringify(u.onboardingData));
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listAll();
