const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    role: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
        default: 'Draft'
    },
    offerDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
