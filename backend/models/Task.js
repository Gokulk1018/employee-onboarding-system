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
        type: Number
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

// Pre-save hook to set points based on priority if not provided
taskSchema.pre('save', function (next) {
    if (this.points === undefined || this.points === null) {
        const pointMap = {
            'High': 10,
            'Medium': 7,
            'Low': 5
        };
        this.points = pointMap[this.priority] || 7;
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);
