const express = require('express');
const router = express.Router();
const {
    createOffer,
    getOffers,
    deleteOffer,
    acceptOffer,
    rejectOffer,
    updateOffer,
    resendOffer,
    advanceOnboardingStep,
    convertOfferToEmployee,
    acceptOfferById,
    rejectOfferById
} = require('../controllers/offerController');

router.route('/').get(getOffers);
router.route('/create').post(createOffer);
router.route('/accept/:token').get(acceptOffer);
router.route('/reject/:token').get(rejectOffer);
router.route('/resend/:id').post(resendOffer);
router.route('/:id/advance').post(advanceOnboardingStep);
router.route('/:id/convert').post(convertOfferToEmployee);
router.route('/:id/accept').post(acceptOfferById);
router.route('/:id/reject').post(rejectOfferById);
router.route('/:id').put(updateOffer).delete(deleteOffer);

module.exports = router;
