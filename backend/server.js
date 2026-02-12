const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route imports
const offerRoutes = require('./routes/offerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const taskRoutes = require('./routes/taskRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

console.log('All modules imported');

const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

console.log('Starting server...');
// Middleware
app.use(express.json());
app.use(cors());
console.log('Middleware initialized');

// Mount Routes
console.log('Mounting routes...');
app.use('/api/offers', offerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('Routes mounted');

// Move listen to BEFORE connectDB to avoid hanging the entire process if DB is slow
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to database
    connectDB();
});

app.get('/', (req, res) => {
    res.send('Employee Onboarding System API - Backend Running');
});

// Error handling middleware (must be after routes)
app.use(errorHandler);
