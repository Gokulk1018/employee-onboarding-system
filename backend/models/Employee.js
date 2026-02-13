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
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
