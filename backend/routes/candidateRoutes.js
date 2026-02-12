const express = require('express');
const router = express.Router();
const {
    createCandidate,
    getCandidates,
    getCandidatesByStage,
    getOfferCandidates,
    moveCandidateStage
} = require('../controllers/candidateController');

router.post('/create', createCandidate);
router.get('/', getCandidates);
router.get('/offers', getOfferCandidates);
router.get('/by-stage/:stage', getCandidatesByStage);
router.put('/:id/move-stage', moveCandidateStage);

module.exports = router;
