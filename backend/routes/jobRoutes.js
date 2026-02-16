const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    getJobCandidates
} = require('../controllers/jobController');
const { applyToJob } = require('../controllers/candidateController');

router.post('/', createJob); // POST /api/jobs
router.get('/', getJobs);    // GET /api/jobs
router.get('/:id', getJobById); // GET /api/jobs/:id
router.post('/:id/apply', applyToJob); // POST /api/jobs/:id/apply
router.get('/:id/candidates', getJobCandidates); // GET /api/jobs/:id/candidates

module.exports = router;
