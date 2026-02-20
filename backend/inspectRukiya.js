const mongoose = require('mongoose');
const OnboardingUser = require('./models/OnboardingUser');
require('dotenv').config();

const inspectUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await OnboardingUser.findOne({ candidateName: 'rukiya' });
        if (user) {
            console.log('--- User Found ---');
            console.log('ID:', user._id);
            console.log('Status:', user.status);
            console.log('Candidate Phone (Top Level):', user.candidatePhone);
            console.log('Candidate Address (Top Level):', user.candidateAddress);
            console.log('Onboarding Data (Map):', user.onboardingData);

            if (user.documents) {
                console.log('Documents Count:', user.documents.length);
            }
        } else {
            console.log('User "rukiya" not found.');
            // List all users to see if names match
            const allUsers = await OnboardingUser.find({}, 'candidateName');
            console.log('All Users:', allUsers.map(u => u.candidateName));
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

// Timeout to prevent hanging
setTimeout(() => {
    console.error('Timeout reached, exiting...');
    process.exit(1);
}, 10000);

inspectUser();
