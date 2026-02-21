const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getPendingOffers,
    sendCredentials,
    getPendingDocuments,
    getPendingLeaves
} = require('../controllers/dashboardController');


router.get('/stats', getDashboardStats);
router.get('/pending-offers', getPendingOffers);
router.post('/send-credentials/:id', sendCredentials);
router.get('/pending-documents', getPendingDocuments);
router.get('/pending-leaves', getPendingLeaves);


module.exports = router;
