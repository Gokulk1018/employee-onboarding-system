const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    type: {
        type: String,
        default: 'general'
    },
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
        default: 'Info',
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
