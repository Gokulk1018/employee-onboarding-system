const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['Admin', 'HR', 'Manager', 'Employee']
    },
    permissions: {
        recruitment: { type: Boolean, default: false },
        onboarding: { type: Boolean, default: false },
        payroll: { type: Boolean, default: false },
        engagement: { type: Boolean, default: false },
        tasks: { type: Boolean, default: false },
        settings: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
