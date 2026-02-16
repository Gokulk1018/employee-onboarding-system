const mongoose = require('mongoose');

const payrollProfileSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    taxPercent: {
        type: Number,
        required: true
    },
    bankName: {
        type: String
    },
    accountNumber: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PayrollProfile', payrollProfileSchema);
