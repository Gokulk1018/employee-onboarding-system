const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    documentType: { type: String, required: true },
    url: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'PENDING'
    },
    verifiedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
