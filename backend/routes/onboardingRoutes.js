const express = require('express');
const router = express.Router();
const {
    getOnboardingStatus,
    updateOnboardingStep,
    submitOnboardingForm,
    approveOnboarding,
    rejectOnboarding,
    getAllOnboardingUsers
} = require('../controllers/onboardingController');

router.post('/submit', submitOnboardingForm);
router.post('/approve/:id', approveOnboarding);
router.post('/reject/:id', rejectOnboarding);
router.get('/users', getAllOnboardingUsers);
router.get('/:employeeId', getOnboardingStatus);
router.put('/:employeeId/update-step', updateOnboardingStep);

module.exports = router;
