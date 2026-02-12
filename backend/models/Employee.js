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
    role: {
        type: String,
        required: true
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
