const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
    try {
        const {
            jobTitle,
            department,
            jobType,
            experienceLevel,
            location,
            openings,
            skills,
            jobDescription,
            salaryRange,
            applicationDeadline
        } = req.body;

        // Validation
        if (!jobTitle || !department || !jobType || !experienceLevel || !location || !jobDescription || !salaryRange || !applicationDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const job = await Job.create({
            jobTitle,
            department,
            jobType,
            experienceLevel,
            location,
            openings,
            skills,
            jobDescription,
            salaryRange,
            applicationDeadline,
            status: 'OPEN'
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: job
        });
    } catch (error) {
        console.error('Create Job Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get candidates for a specific job
// @route   GET /api/jobs/:id/candidates
// @access  Private/Admin
exports.getJobCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ jobId: req.params.id });
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
