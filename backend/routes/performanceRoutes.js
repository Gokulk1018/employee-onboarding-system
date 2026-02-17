const express = require('express');
const router = express.Router();
const {
    createGoal,
    getGoals,
    updateGoal,
    submitReview,
    getPerformanceSummary,
    getPendingReviews
} = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists

// Goal Routes
router.route('/goals')
    .post(protect, createGoal)
    .get(protect, getGoals);

router.route('/goals/:id')
    .put(protect, updateGoal);

// Review Routes
router.route('/reviews')
    .post(protect, submitReview);

router.route('/summary/:employeeId')
    .get(protect, getPerformanceSummary);

router.route('/pending/:reviewerId')
    .get(protect, getPendingReviews);

module.exports = router;
