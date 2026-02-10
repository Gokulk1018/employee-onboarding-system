const express = require('express');
const router = express.Router();
const { getOnboardingStatus, updateOnboardingStep } = require('../controllers/onboardingController');

router.get('/:employeeId', getOnboardingStatus);
router.put('/:employeeId/update-step', updateOnboardingStep);

module.exports = router;
