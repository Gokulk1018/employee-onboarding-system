const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Accepted', 'Rejected'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
