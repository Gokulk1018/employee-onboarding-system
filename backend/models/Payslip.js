const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayrollTransaction',
        required: true
    },
    pdfUrl: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payslip', payslipSchema);
