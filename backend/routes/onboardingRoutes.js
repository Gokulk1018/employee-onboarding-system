const express = require('express');
const router = express.Router();
const { getOnboardingStatus, updateOnboardingStep, candidateLogin } = require('../controllers/onboardingController');

router.post('/login', candidateLogin);
router.get('/:employeeId', getOnboardingStatus);
router.put('/:employeeId/update-step', updateOnboardingStep);

module.exports = router;
