const mongoose = require('mongoose');

const engagementScoreSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    month: {
        type: String, // e.g., "January"
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EngagementScore', engagementScoreSchema);
