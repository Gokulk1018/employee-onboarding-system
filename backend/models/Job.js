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
        enum: ['Full-time', 'Part-time', 'Contract'],
        default: 'Full-time'
    },
    experienceLevel: {
        type: String,
        required: [true, 'Experience level is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
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
