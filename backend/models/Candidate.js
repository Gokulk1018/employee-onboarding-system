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
        type: String,
        required: [true, 'Phone number is required']
    },
    resumeUrl: {
        type: String,
        required: [true, 'Resume URL is required']
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: String,
        required: [true, 'Experience is required']
    },
    stage: {
        type: String,
        enum: ['Applied', 'Screening', 'Technical Round', 'HR Interview', 'Selected', 'Rejected'],
        default: 'Applied'
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: false
    },
    targetRole: {
        type: String,
        default: 'Software Engineer'
    },
    resumeText: {
        type: String,
        default: ''
    },
    atsScore: {
        type: Number,
        default: 0
    },
    hiringRecommendation: {
        type: String,
        default: 'Pending Evaluation'
    },
    hrBrief: {
        type: String,
        default: ''
    },
    skillsAnalysis: {
        matchingSkills: [String],
        missingCriticalSkills: [String],
        bonusSkills: [String]
    },
    evaluationBreakdown: {
        technicalFitScore: Number,
        experienceDepthScore: Number,
        impactMetricsScore: Number,
        formattingClarityScore: Number
    },
    auditInsights: {
        topStrengths: [String],
        redFlagsOrGaps: [String]
    },
    status: {
        type: String,
        enum: ['PENDING', 'HIRED', 'REJECTED'],
        default: 'PENDING'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
