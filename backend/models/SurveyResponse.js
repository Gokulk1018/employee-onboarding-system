const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    answers: [{
        questionText: { // Storing text too in case question changes, or just rely on index/ID
            type: String,
            required: true
        },
        answer: {
            type: mongoose.Schema.Types.Mixed, // Can be String, Number, or Boolean
            required: true
        }
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent multiple responses from same employee for same survey
surveyResponseSchema.index({ surveyId: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
