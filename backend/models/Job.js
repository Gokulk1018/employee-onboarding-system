const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    jobType: {
        type: String,
        required: [true, 'Job type is required'],
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    experienceLevel: {
        type: String,
        required: [true, 'Experience level is required'],
        enum: ['Fresher', 'Junior', 'Mid', 'Senior'],
        default: 'Junior'
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        enum: ['Onsite', 'Remote', 'Hybrid'],
        default: 'Onsite'
    },
    openings: {
        type: Number,
        required: [true, 'Number of openings is required'],
        default: 1
    },
    skills: {
        type: [String],
        default: []
    },
    jobDescription: {
        type: String,
        required: [true, 'Job description is required']
    },
    salaryRange: {
        type: String,
        required: [true, 'Salary range is required'],
        trim: true
    },
    applicationDeadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    googleFormUrl: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
