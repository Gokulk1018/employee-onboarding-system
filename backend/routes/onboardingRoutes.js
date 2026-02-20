const express = require('express');
const router = express.Router();
const {
    getOnboardingStatus,
    updateOnboardingStep,
    submitOnboardingForm,
    approveOnboarding,
    rejectOnboarding,
    rejectOnboardingDetails,
    finalizeOnboarding,
    verifyDocument,
    getAllOnboardingUsers,
    getOnboardingUser
} = require('../controllers/onboardingController');

router.post('/submit', submitOnboardingForm);
router.post('/approve/:id', approveOnboarding);
router.post('/reject/:id', rejectOnboarding);
router.post('/reject-details/:id', rejectOnboardingDetails);
router.post('/finalize/:id', finalizeOnboarding);
router.put('/verify-document/:id', verifyDocument);
router.get('/users', getAllOnboardingUsers);
router.get('/:employeeId', getOnboardingStatus);
router.put('/:employeeId/update-step', updateOnboardingStep);
router.get('/user/:id', getOnboardingUser);

module.exports = router;
