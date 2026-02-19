const mongoose = require('mongoose');

const EmployeeRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: [true, 'Please specify a request type'],
        enum: ['Network Issue', 'System Access', 'Salary Issue', 'Personal Query', 'Leave Request', 'Other']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    },
    hrReply: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EmployeeRequest', EmployeeRequestSchema);
