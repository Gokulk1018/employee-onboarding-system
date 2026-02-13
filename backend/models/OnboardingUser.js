const mongoose = require('mongoose');

const onboardingUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        default: '123'
    },
    candidateName: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'approved', 'rejected'],
        default: 'pending'
    },
    onboardingData: {
        type: Map,
        of: String
    },
    documents: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('OnboardingUser', onboardingUserSchema);
