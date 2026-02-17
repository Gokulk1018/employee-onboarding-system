const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Yes/No', 'Multiple Choice', 'Rating', 'Text'],
            default: 'Text'
        },
        options: [{ // For Multiple Choice
            type: String
        }]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HRUser'
    },
    deadline: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);
