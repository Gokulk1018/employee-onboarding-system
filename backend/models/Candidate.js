const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Candidate name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String
    },
    currentStage: {
        type: String,
        enum: ['Applied', 'Screening', 'Interview', 'Offer'],
        default: 'Applied'
    },
    resumeUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
