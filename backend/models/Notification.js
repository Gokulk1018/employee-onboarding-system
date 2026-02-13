const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: false
    },
    candidateEmail: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Pending', 'Info'],
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
