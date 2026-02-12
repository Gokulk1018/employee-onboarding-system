const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById
} = require('../controllers/jobController');

router.post('/create', createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;
