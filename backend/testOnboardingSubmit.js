// const axios = require('axios'); // Removed, using fetch

const mongoose = require('mongoose');
const OnboardingUser = require('./models/OnboardingUser'); // Just to ensure model is loaded if needed, though we use API
require('dotenv').config();

const API_URL = 'http://localhost:5000/api/onboarding';

const testSubmission = async () => {
    try {
        // 1. Find a user to test with (e.g., 'rukiya' or create one)
        // For safety, let's use a known user ID if possible, or search by name.
        // We'll search by name 'test_candidate' or similar, or just pick the first pending/reupload one.

        // Let's assume we can fetch all users first to find a suitable one
        // But since we don't have that API exposed easily here without auth sometimes, let's just use the DB directly to get an ID.

        await mongoose.connect(process.env.MONGO_URI);
        let user = await OnboardingUser.findOne({ candidateName: 'rukiya' });

        if (!user) {
            console.log('User "rukiya" not found. Creating a dummy user for testing.');
            user = await OnboardingUser.create({
                username: 'test_user',
                password: '123',
                candidateName: 'Test Candidate',
                candidateEmail: 'test@example.com',
                offerId: new mongoose.Types.ObjectId(),
                status: 'pending'
            });
        }

        const userId = user._id.toString();
        // Reset status to pending to allow submission
        user.status = 'pending';
        // Clear onboarding data
        user.onboardingData = {};
        await user.save();

        console.log(`Testing with User ID: ${userId}`);

        // 2. Submit Data
        const payload = {
            userId: userId,
            personalData: {
                fullName: user.candidateName,
                email: user.candidateEmail,
                phone: "9876543210",
                address: "123 Baker Street, London"
            },
            documents: []
        };

        console.log('Sending Payload:', payload);

        try {
            const res = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            console.log('Submission Response:', res.status, data);
        } catch (e) {
            console.error('Submission Failed:', e.message);
        }

        // 3. Verify Persistence in DB
        const updatedUser = await OnboardingUser.findById(userId);
        console.log('Updated User Status:', updatedUser.status);
        console.log('Updated Onboarding Data:', updatedUser.onboardingData);

        if (updatedUser.onboardingData instanceof Map) {
            console.log('As Map Object:', Object.fromEntries(updatedUser.onboardingData));
        }

        mongoose.disconnect();

    } catch (err) {
        console.error(err);
        if (mongoose.connection.readyState === 1) mongoose.disconnect();
    }
};

testSubmission();
