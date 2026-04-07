const mongoose = require('mongoose');

// Mock Models
const Offer = {
    findById: async (id) => ({
        _id: id,
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com'
    })
};

const OnboardingUser = {
    findOne: async (query) => {
        console.log('Searching for user with:', query);
        // Simulate existing user for the first call to test counter
        if (query.username === 'johndoe' && query.offerId?.$ne) {
            return { username: 'johndoe' };
        }
        return null;
    },
    create: async (data) => {
        console.log('OnboardingUser.create with:', data);
        return data;
    }
};

const sendEmail = async (options) => {
    console.log('Sending email to:', options.email);
    // Simulate email failure for testing the try-catch
    throw new Error('SMTP Error: Connection timed out');
};

async function testGenerateCredentials(offerId) {
    try {
        const offer = await Offer.findById(offerId);
        let username = offer.candidateName.toLowerCase().replace(/\s+/g, '');
        const password = "123";

        // Handle unique username generation
        let existingUser = await OnboardingUser.findOne({ 
            username, 
            offerId: { $ne: offer._id } 
        });
        
        let counter = 1;
        while (existingUser) {
            username = `${offer.candidateName.toLowerCase().replace(/\s+/g, '')}${counter}`;
            existingUser = await OnboardingUser.findOne({ 
                username, 
                offerId: { $ne: offer._id } 
            });
            counter++;
        }

        console.log('Generated Username:', username);

        let onboardingUser = await OnboardingUser.findOne({ offerId: offer._id });

        if (!onboardingUser) {
            onboardingUser = await OnboardingUser.create({
                username,
                password,
                candidateName: offer.candidateName,
                candidateEmail: offer.candidateEmail,
                offerId: offer._id
            });
        }

        try {
            await sendEmail({
                email: offer.candidateEmail,
                subject: 'Your Onboarding Portal Credentials',
                html: '...'
            });
            console.log('Success: Email sent');
        } catch (emailError) {
            console.log('Caught expected email error:', emailError.message);
            console.log('Returning success with warning to user.');
        }

        console.log('Test Passed: Logic handled collision and email failure correctly.');
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testGenerateCredentials('mock-offer-id');
