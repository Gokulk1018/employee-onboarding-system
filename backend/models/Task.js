const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['todo', 'inProgress', 'done'],
        default: 'todo'
    },
    dueDate: {
        type: Date
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    points: {
        type: Number,
        default: 7 // Default for medium
    },
    estimatedHours: {
        type: Number,
        default: 0
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    department: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    attachments: {
        type: Number,
        default: 0
    },
    pinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
