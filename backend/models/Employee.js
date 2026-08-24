const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    offerId: {
        type: String
    },
    joinDate: {
        type: Date
    },
    avatar: {
        type: String
    },
    phone: {
        type: String
    },
    location: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: 'employee'
    },
    accountStatus: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    leaveBalance: {
        annual: { type: Number, default: 18 },
        sick: { type: Number, default: 12 },
        casual: { type: Number, default: 5 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
