const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Can also be HRUser, but usually reviews are done by managers (Employees)
        required: true
    },
    reviewPeriod: {
        type: String,
        required: true // e.g., "Q1 2024", "Annual 2023"
    },
    ratings: {
        communication: { type: Number, min: 1, max: 5, default: 0 },
        technical: { type: Number, min: 1, max: 5, default: 0 },
        leadership: { type: Number, min: 1, max: 5, default: 0 },
        teamwork: { type: Number, min: 1, max: 5, default: 0 },
        punctuality: { type: Number, min: 1, max: 5, default: 0 },
        problemSolving: { type: Number, min: 1, max: 5, default: 0 }
    },
    averageRating: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Self Assessment', 'Peer Review', 'Manager Review', 'Final Discussion', 'Completed'],
        default: 'Self Assessment'
    },
    submittedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Calculate average rating before saving
performanceReviewSchema.pre('save', function (next) {
    if (this.ratings) {
        const { communication, technical, leadership, teamwork, punctuality, problemSolving } = this.ratings;
        const total = communication + technical + leadership + teamwork + punctuality + problemSolving;
        // Count only non-zero ratings if you want to allow partial ratings, 
        // OR simply divide by 6 if all are required. 
        // Assuming all are required for a simplified calculation:
        this.averageRating = parseFloat((total / 6).toFixed(1));
    }
    next();
});

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
