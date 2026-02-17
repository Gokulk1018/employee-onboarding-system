const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
        // Optional: If null, it's truly anonymous (if isAnonymous is true)
        // However, usually we might want to track who sent it but hide it from viewers if isAnonymous is true.
        // For strict anonymity, we can leave this null.
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['Suggestion', 'Complaint', 'Appreciation', 'Other'],
        default: 'Suggestion'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    },
    response: {
        type: String // Optional response from HR/Admin
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
