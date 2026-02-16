const express = require('express');
const router = express.Router();
const {
    getCandidates,
    updateCandidateStage,
    hireCandidate
} = require('../controllers/candidateController');

router.get('/', getCandidates); // GET /api/candidates
router.patch('/:id/stage', updateCandidateStage); // PATCH /api/candidates/:id/stage
router.patch('/:id/hire', hireCandidate); // PATCH /api/candidates/:id/hire

module.exports = router;
