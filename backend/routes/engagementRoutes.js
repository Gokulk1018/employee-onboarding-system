const express = require('express');
const router = express.Router();
const {
    sendRecognition,
    getRecognitions,
    toggleLike,
    submitFeedback,
    getFeedback,
    createSurvey,
    getSurveys,
    submitSurveyResponse,
    getEngagementAnalytics,
    getLeaderboard
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists

// Recognition Routes
router.route('/recognition')
    .post(protect, sendRecognition)
    .get(protect, getRecognitions);

router.route('/recognition/:id/like')
    .post(protect, toggleLike);

// Feedback Routes
router.route('/feedback')
    .post(protect, submitFeedback)
    .get(protect, getFeedback); // Likely Admin only

// Survey Routes
router.route('/survey')
    .post(protect, createSurvey) // Likely HR/Admin only
    .get(protect, getSurveys);

router.route('/survey/response')
    .post(protect, submitSurveyResponse);

// Analytics Routes
router.route('/analytics')
    .get(protect, getEngagementAnalytics);

router.route('/leaderboard')
    .get(protect, getLeaderboard);

module.exports = router;
