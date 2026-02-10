const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
