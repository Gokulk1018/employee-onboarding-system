const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    leaveType: {
        type: String,
        required: [true, 'Please specify a leave type'],
        enum: ['Annual', 'Sick', 'Casual']
    },
    startDate: {
        type: Date,
        required: [true, 'Please specify a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please specify an end date']
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason for leave']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    appliedOn: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Leave', LeaveSchema);
