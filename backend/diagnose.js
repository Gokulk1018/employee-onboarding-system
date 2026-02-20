const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

try {
    console.log('Testing imports...');
    const offerRoutes = require('./routes/offerRoutes');
    const employeeRoutes = require('./routes/employeeRoutes');
    const documentRoutes = require('./routes/documentRoutes');
    const onboardingRoutes = require('./routes/onboardingRoutes');
    const taskRoutes = require('./routes/taskRoutes');
    const jobRoutes = require('./routes/jobRoutes');
    const candidateRoutes = require('./routes/candidateRoutes');
    const notificationRoutes = require('./routes/notificationRoutes');
    const authRoutes = require('./routes/authRoutes');
    const payrollRoutes = require('./routes/payrollRoutes');
    const performanceRoutes = require('./routes/performanceRoutes');
    const engagementRoutes = require('./routes/engagementRoutes');
    const settingsRoutes = require('./routes/settingsRoutes');
    const dashboardRoutes = require('./routes/dashboardRoutes');
    console.log('All imports successful!');
} catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
}
