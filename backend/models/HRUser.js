const mongoose = require('mongoose');

const hrUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    role: {
        type: String,
        default: 'hr'
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lastFailedLogin: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HRUser', hrUserSchema);
