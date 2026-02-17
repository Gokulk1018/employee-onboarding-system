const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const connectDB = require('../config/db');

// Models
const Employee = require('../models/Employee');
const Goal = require('../models/Goal');
const PerformanceReview = require('../models/PerformanceReview');
const Recognition = require('../models/Recognition');
const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');

dotenv.config();

// Helper for file logging
const logFile = 'verify_output.txt';
// Clear previous log
try { fs.unlinkSync(logFile); } catch (e) { }

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '\n');
};

const runVerification = async () => {
    try {
        await connectDB();
        log('MongoDB Connected for Verification');

        // 1. Setup Test Data (Find an employee to act as user)
        const employee = await Employee.findOne();
        if (!employee) {
            log('No employees found. Please seed employees first.');
            process.exit(1);
        }
        log(`Using Employee: ${employee.name} (${employee._id})`);

        // Mock Request Object
        const mockReq = (body = {}, params = {}, query = {}, user = { data: { userId: employee._id } }) => ({
            body,
            params,
            query,
            user
        });

        // Mock Response Object
        const mockRes = () => {
            const res = {};
            res.statusCode = 200; // Default
            res.data = null;
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };
            res.json = (data) => {
                res.data = data;
                return res;
            };
            return res;
        };

        const next = (err) => {
            if (err) log('Error: ' + err);
        };

        // ==========================================
        // PERFORMANCE MODULE TESTS
        // ==========================================
        log('\n--- TESTING PERFORMANCE MODULE ---');
        const performanceController = require('../controllers/performanceController');

        // Test Create Goal
        const goalReq = mockReq({
            title: 'Test Goal',
            description: 'Finish verification script',
            category: 'Project',
            dueDate: new Date()
        });
        const goalRes = mockRes();
        await performanceController.createGoal(goalReq, goalRes, next);
        log('Create Goal: ' + (goalRes.statusCode === 201 ? 'SUCCESS' : 'FAILED'));
        if (goalRes.statusCode !== 201) log(goalRes.data);

        // Test Get Goals
        const getGoalsReq = mockReq({}, {}, { employeeId: employee._id });
        const getGoalsRes = mockRes();
        await performanceController.getGoals(getGoalsReq, getGoalsRes, next);
        log('Get Goals: ' + (getGoalsRes.statusCode === 200 ? `SUCCESS (${getGoalsRes.data.count} goals)` : 'FAILED'));

        // Test Submit Review (Self Assessment)
        const reviewReq = mockReq({
            employeeId: employee._id,
            reviewPeriod: `Test Period ${Date.now()}`,
            ratings: { communication: 5, technical: 4, leadership: 3, teamwork: 5, punctuality: 4, problemSolving: 5 },
            status: 'Completed'
        });
        const reviewRes = mockRes();
        await performanceController.submitReview(reviewReq, reviewRes, next);
        log('Submit Review: ' + (reviewRes.statusCode === 201 ? 'SUCCESS' : 'FAILED'));

        // Test Get Summary
        const summaryReq = mockReq({}, { employeeId: employee._id });
        const summaryRes = mockRes();
        await performanceController.getPerformanceSummary(summaryReq, summaryRes, next);
        log('Get Summary: ' + (summaryRes.statusCode === 200 ? 'SUCCESS' : 'FAILED'));
        if (summaryRes.statusCode === 200) log('  Avg Rating: ' + summaryRes.data.data.averageRating);


        // ==========================================
        // ENGAGEMENT MODULE TESTS
        // ==========================================
        log('\n--- TESTING ENGAGEMENT MODULE ---');
        const engagementController = require('../controllers/engagementController');

        // Test Send Recognition
        const recognitionReq = mockReq({
            receiverId: employee._id, // Sending to self for test
            message: 'Great job on the testing!',
            category: 'Excellence'
        });
        const recognitionRes = mockRes();
        await engagementController.sendRecognition(recognitionReq, recognitionRes, next);
        log('Send Recognition: ' + (recognitionRes.statusCode === 201 ? 'SUCCESS' : 'FAILED'));

        // Test Get Recognitions
        const getRecogRes = mockRes();
        await engagementController.getRecognitions(mockReq(), getRecogRes, next);
        log('Get Recognitions: ' + (getRecogRes.statusCode === 200 ? `SUCCESS (${getRecogRes.data.count} items)` : 'FAILED'));

        // Test Create Survey
        const surveyReq = mockReq({
            title: `Test Survey ${Date.now()}`,
            questions: [{ questionText: 'Is this working?', type: 'Yes/No' }]
        });
        const surveyRes = mockRes();
        await engagementController.createSurvey(surveyReq, surveyRes, next);
        log('Create Survey: ' + (surveyRes.statusCode === 201 ? 'SUCCESS' : 'FAILED'));
        const surveyId = surveyRes.data.data?._id;

        if (surveyId) {
            // Test Submit Response
            const responseReq = mockReq({
                surveyId: surveyId,
                answers: [{ questionText: 'Is this working?', answer: 'Yes' }]
            });
            const responseRes = mockRes();
            await engagementController.submitSurveyResponse(responseReq, responseRes, next);
            log('Submit Survey Response: ' + (responseRes.statusCode === 201 ? 'SUCCESS' : 'FAILED'));
        }

        // Test Analytics
        const analyticsRes = mockRes();
        await engagementController.getEngagementAnalytics(mockReq(), analyticsRes, next);
        log('Get Analytics: ' + (analyticsRes.statusCode === 200 ? 'SUCCESS' : 'FAILED'));
        if (analyticsRes.statusCode === 200) log('  Sentiment: ' + JSON.stringify(analyticsRes.data.data.sentiment));

        log('\nVerification Complete!');
        process.exit();
    } catch (err) {
        log('Unexpected Error: ' + err);
        process.exit(1);
    }
};

runVerification();
