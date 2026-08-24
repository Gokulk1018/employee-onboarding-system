const express = require('express');
const router = express.Router();
const {
    getCandidates,
    updateCandidateStage,
    hireCandidate,
    handleGoogleFormWebhook,
    analyzeCandidateResume
} = require('../controllers/candidateController');

router.get('/', getCandidates); // GET /api/candidates
router.post('/webhook', handleGoogleFormWebhook); // POST /api/candidates/webhook
router.post('/:id/analyze', analyzeCandidateResume); // POST /api/candidates/:id/analyze
router.patch('/:id/stage', updateCandidateStage); // PATCH /api/candidates/:id/stage
router.patch('/:id/hire', hireCandidate); // PATCH /api/candidates/:id/hire

module.exports = router;
