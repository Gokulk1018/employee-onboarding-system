const mongoose = require('mongoose');
const OnboardingUser = require('./models/OnboardingUser');
require('dotenv').config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await OnboardingUser.findOne({ candidateName: 'rukiya' });
        if (user) {
            console.log('User Found:', user.candidateName);
            console.log('Onboarding Data:', user.onboardingData);
            console.log('Is Map?', user.onboardingData instanceof Map);
            if (user.onboardingData instanceof Map) {
                console.log('Map Entries:', JSON.stringify(Object.fromEntries(user.onboardingData)));
            } else {
                console.log('Data Object:', JSON.stringify(user.onboardingData));
            }
        } else {
            console.log('User not found');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkData();
