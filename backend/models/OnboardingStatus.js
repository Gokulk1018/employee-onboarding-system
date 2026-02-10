const mongoose = require('mongoose');

const onboardingStatusSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    currentStep: {
        type: String,
        enum: [
            'OFFER_CREATED',
            'OFFER_ACCEPTED',
            'ACCOUNT_CREATED',
            'DOCUMENTS_UPLOADED',
            'DOCUMENTS_VERIFIED',
            'ASSIGNED',
            'ACTIVE'
        ],
        default: 'OFFER_CREATED'
    },
    stepHistory: [{
        step: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('OnboardingStatus', onboardingStatusSchema);
