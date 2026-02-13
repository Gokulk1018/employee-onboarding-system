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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HRUser', hrUserSchema);
