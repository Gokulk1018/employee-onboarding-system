const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    companyInfo: {
        companyName: { type: String, default: 'HRFlow Inc.' },
        hrEmail: { type: String, default: 'hr@hrflow.com' },
        phone: { type: String, default: '+1 (555) 123-4567' },
        location: { type: String, default: 'New York, NY' },
        timezone: { type: String, default: 'UTC-05:00' },
        logoUrl: { type: String, default: '' }
    },
    security: {
        loginAlert: { type: Boolean, default: true },
        sessionTimeout: { type: String, default: '30' }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
