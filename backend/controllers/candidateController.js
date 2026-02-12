const Candidate = require('../models/Candidate');

// @desc    Create new candidate
// @route   POST /api/candidates/create
// @access  Public
exports.createCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.create(req.body);
        res.status(201).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('jobId', 'title department').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get candidates by stage
// @route   GET /api/candidates/by-stage/:stage
// @access  Public
exports.getCandidatesByStage = async (req, res) => {
    try {
        const stage = req.params.stage.toUpperCase();
        const candidates = await Candidate.find({ currentStage: stage }).populate('jobId', 'title department');
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get offer candidates (currentStage = OFFER)
// @route   GET /api/candidates/offers
// @access  Public
exports.getOfferCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ currentStage: 'OFFER' }).populate('jobId', 'title department');
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Move candidate stage
// @route   PUT /api/candidates/:id/move-stage
// @access  Public
exports.moveCandidateStage = async (req, res) => {
    try {
        const { currentStage } = req.body;
        const validStages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'];

        if (!currentStage || !validStages.includes(currentStage.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid stage'
            });
        }

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { currentStage: currentStage.toUpperCase() },
            { new: true, runValidators: true }
        ).populate('jobId', 'title department');

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
