const express = require('express');
const router = express.Router();
const {
    createForm,
    getForms,
    getFormById,
    submitResponse,
    getFormAnalytics,
    getWallResponses,
    replyToResponse,
    createRequest,
    getRequests,
    updateRequest,
    updateForm,
    deleteForm,
    getRecognitions,
    createRecognition,
    toggleLike,
    getEngagementInsights
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');

// Form Routes
router.route('/forms')
    .post(protect, createForm)
    .get(protect, getForms);

router.get('/wall', protect, getWallResponses);

router.route('/forms/:id')
    .get(protect, getFormById)
    .put(protect, updateForm)
    .delete(protect, deleteForm);

router.route('/forms/respond')
    .post(protect, submitResponse);

router.put('/responses/:id/reply', protect, replyToResponse);

router.route('/forms/analytics/:id')
    .get(protect, getFormAnalytics);

// Request / Ticket Routes
router.route('/request')
    .post(protect, createRequest)
    .get(protect, getRequests);

router.route('/request/:id')
    .put(protect, updateRequest);

// Recognition Routes
router.route('/recognitions')
    .get(protect, getRecognitions)
    .post(protect, createRecognition);

router.put('/recognitions/:id/like', protect, toggleLike);

// Insights Route
router.get('/insights', protect, getEngagementInsights);

module.exports = router;
