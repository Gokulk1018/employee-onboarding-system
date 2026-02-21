const mongoose = require('mongoose');

const EngagementResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.ObjectId,
        ref: 'EngagementForm',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    selectedOption: {
        type: String,
        enum: ['Good', 'Not Bad', 'Worst', 'Need Improvement'],
        required: function () { return this.formType === 'survey'; }
    },
    message: {
        type: String,
        trim: true
    },
    hrReply: {
        type: String,
        trim: true
    },
    hrReplyDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EngagementResponse', EngagementResponseSchema);
