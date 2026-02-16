const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Public
exports.applyToJob = async (req, res) => {
    try {
        const { name, email, phone, resumeUrl, skills, experience } = req.body;
        const jobId = req.params.id;

        const candidate = await Candidate.create({
            name,
            email,
            phone,
            resumeUrl,
            skills,
            experience,
            jobId,
            stage: 'Applied'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
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
// @access  Private/Admin
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('jobId', 'jobTitle department').sort({ createdAt: -1 });
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

// @desc    Update candidate stage
// @route   PATCH /api/candidates/:id/stage
// @access  Private/Admin
exports.updateCandidateStage = async (req, res) => {
    try {
        const { stage } = req.body;
        const validStages = ['Applied', 'Screening', 'Technical Round', 'HR Interview', 'Selected', 'Rejected'];

        if (!stage || !validStages.includes(stage)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid stage'
            });
        }

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { stage },
            { new: true, runValidators: true }
        ).populate('jobId', 'jobTitle department');

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

// @desc    Hire candidate (Trigger onboarding)
// @route   PATCH /api/candidates/:id/hire
// @access  Private/Admin
exports.hireCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        if (candidate.status === 'HIRED') {
            return res.status(400).json({
                success: false,
                message: 'Candidate is already hired'
            });
        }

        // Update candidate status
        candidate.status = 'HIRED';
        candidate.stage = 'Selected';
        await candidate.save();

        // Create Employee record
        const job = await Job.findById(candidate.jobId);

        // Generate a simple employee ID (e.g., EMP + random string or sequence)
        const employeeId = 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const employee = await Employee.create({
            employeeId,
            fullName: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            department: job ? job.department : 'Unassigned',
            role: job ? job.jobTitle : 'Employee',
            status: 'Onboarding',
            joinDate: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Candidate hired and employee record created',
            data: { candidate, employee }
        });
    } catch (error) {
        console.error('Hire Candidate Error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
