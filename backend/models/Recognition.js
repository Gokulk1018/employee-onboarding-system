const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Teamwork', 'Innovation', 'Leadership', 'Helpfulness', 'Excellence'],
        default: 'Teamwork'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recognition', recognitionSchema);
