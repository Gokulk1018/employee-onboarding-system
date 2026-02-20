const mongoose = require('mongoose');
const Offer = require('./models/Offer');
require('dotenv').config();

const inspectSpecificOffer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const offerId = '698e97f0ff329f1d86abf3e7';
        const offer = await Offer.findById(offerId);

        if (offer) {
            console.log('--- Offer Found ---');
            console.log('ID:', offer._id);
            console.log('Candidate:', offer.candidateName);
            console.log('Email:', offer.candidateEmail);
            console.log('Department:', offer.department);
            console.log('Onboarding Step:', offer.onboardingStep);
            console.log('Status:', offer.status);
            console.log('Credentials Sent:', offer.credentialsSent);
        } else {
            console.log(`Offer ${offerId} not found.`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

inspectSpecificOffer();
