const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: [true, 'Candidate name is required'],
        default: ""
    },
    candidateEmail: {
        type: String,
        required: [true, 'Candidate email is required']
    },
    candidatePhone: {
        type: String
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required']
    },
    joiningDate: {
        type: Date,
        required: [true, 'Joining date is required']
    },
    personalMessage: {
        type: String
    },
    status: {
        type: String,
        enum: ['Sent', 'Accepted', 'Rejected'],
        default: 'Sent'
    },
    token: {
        type: String,
        unique: true
    },
    onboardingStep: {
        type: String,
        enum: ['Offer Accepted', 'Documentation', 'IT Setup', 'Orientation', 'Ready'],
        default: 'Offer Accepted'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
