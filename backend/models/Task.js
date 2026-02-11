const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    assignee: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    pinned: {
        type: Boolean,
        default: false
    },
    attachments: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
