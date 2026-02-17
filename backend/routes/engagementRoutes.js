const express = require('express');
const router = express.Router();
const {
    createForm,
    getForms,
    getFormById,
    submitResponse,
    getFormAnalytics,
    createRequest,
    getRequests,
    updateRequest,
    updateForm,
    deleteForm
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');

// Form Routes
router.route('/forms')
    .post(protect, createForm)
    .get(protect, getForms);

router.route('/forms/:id')
    .get(protect, getFormById)
    .put(protect, updateForm)
    .delete(protect, deleteForm);

router.route('/forms/respond')
    .post(protect, submitResponse);

router.route('/forms/analytics/:id')
    .get(protect, getFormAnalytics);

// Request / Ticket Routes
router.route('/request')
    .post(protect, createRequest)
    .get(protect, getRequests);

router.route('/request/:id')
    .put(protect, updateRequest);

module.exports = router;
