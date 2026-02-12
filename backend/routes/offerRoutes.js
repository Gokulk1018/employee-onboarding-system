const express = require('express');
const router = express.Router();
const {
    createOffer,
    getOffers,
    deleteOffer,
    acceptOffer,
    rejectOffer,
    updateOffer,
    resendOffer
} = require('../controllers/offerController');

router.post('/create', createOffer);
router.get('/', getOffers);
router.delete('/:id', deleteOffer);
router.put('/:id', updateOffer);
router.post('/resend/:id', resendOffer);

// Token-based endpoints for email links
router.get('/accept/:token', acceptOffer);
router.get('/reject/:token', rejectOffer);

module.exports = router;
