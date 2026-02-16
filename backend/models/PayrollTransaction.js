const mongoose = require('mongoose');

const payrollTransactionSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    monthIndex: {
        type: Number,
        required: true
    },
    grossSalary: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true
    },
    netSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Paid'
    }
}, {
    timestamps: true
});

// Unique compound index: { employeeId, month, year }
payrollTransactionSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('PayrollTransaction', payrollTransactionSchema);
