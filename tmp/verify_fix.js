const mongoose = require('mongoose');

// Mock Models
const OnboardingUser = {
    findById: async (id) => ({
        _id: id,
        candidateName: 'John Doe',
        status: 'pending',
        onboardingData: new Map(),
        save: async () => console.log('User saved')
    })
};

const Notification = {
    create: async (data) => {
        console.log('Notification created with:', data);
        if (!data.message) throw new Error('Message is required');
        return data;
    }
};

async function testSubmit(userId) {
    try {
        const user = await OnboardingUser.findById(userId);
        const isReupload = user.status === 'reupload_required';
        const notificationMsg = `${isReupload ? 'Updated' : 'New'} onboarding form submitted by ${user.candidateName}`;
        
        user.status = 'submitted';
        await user.save();

        await Notification.create({
            title: 'Onboarding Submission',
            message: notificationMsg,
            candidateName: user.candidateName,
            candidateEmail: 'john@example.com',
            status: 'Pending',
            isGlobal: true,
            link: '/onboarding'
        });

        console.log('Test Passed: Submit logic executed without ReferenceError');
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testSubmit('mock-id');
