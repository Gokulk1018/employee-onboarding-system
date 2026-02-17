const mongoose = require('mongoose');

const EngagementFormSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Project Review', 'Training Review', 'Onboarding Feedback', 'General Feedback']
    },
    formType: {
        type: String,
        required: [true, 'Please specify a form type'],
        enum: ['feedback', 'survey']
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['allEmployees', 'selectedEmployees', 'department']
    },
    targetEmployees: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Employee'
    }],
    targetDepartment: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'HRUser',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EngagementForm', EngagementFormSchema);
