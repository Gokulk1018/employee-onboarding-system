const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    onboardingStatusId: { type: mongoose.Schema.Types.ObjectId, ref: 'OnboardingStatus' },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive', 'Probation'], default: 'Active' },
    joinDate: { type: Date },
    avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
