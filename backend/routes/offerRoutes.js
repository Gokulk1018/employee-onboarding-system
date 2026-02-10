const express = require('express');
const router = express.Router();
const {
    createOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    acceptOffer,
    rejectOffer
} = require('../controllers/offerController');

router.post('/create', createOffer);
router.get('/', getOffers);
router.get('/accept/:id', acceptOffer);
router.get('/reject/:id', rejectOffer);
router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);

module.exports = router;
