const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    onboardingStatusId: { type: mongoose.Schema.Types.ObjectId, ref: 'OnboardingStatus' },
    status: { type: String, enum: ['INACTIVE', 'ACTIVE'], default: 'INACTIVE' },
    joiningDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
