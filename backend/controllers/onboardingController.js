const OnboardingStatus = require('../models/OnboardingStatus');
const Employee = require('../models/Employee');

// @desc    Get onboarding status for an employee
// @route   GET /api/onboarding/:employeeId
exports.getOnboardingStatus = async (req, res, next) => {
    try {
        const status = await OnboardingStatus.findOne({ employeeId: req.params.employeeId });
        if (!status) {
            res.status(404);
            throw new Error('Onboarding status not found');
        }
        res.status(200).json({ success: true, data: status });
    } catch (err) {
        next(err);
    }
};

// @desc    Update onboarding step manually
// @route   PUT /api/onboarding/:employeeId/update-step
exports.updateOnboardingStep = async (req, res, next) => {
    try {
        const { step } = req.body;

        if (!step) {
            res.status(400);
            throw new Error('Please provide the new onboarding step');
        }

        const status = await OnboardingStatus.findOneAndUpdate(
            { employeeId: req.params.employeeId },
            {
                $set: { currentStep: step },
                $push: { stepHistory: { step } }
            },
            { new: true, runValidators: true }
        );

        if (!status) {
            res.status(404);
            throw new Error('Onboarding status not found');
        }

        // If step is ACTIVE, update Employee overall status
        if (step === 'ACTIVE') {
            await Employee.findByIdAndUpdate(req.params.employeeId, { status: 'ACTIVE' });
        }

        res.status(200).json({ success: true, data: status });
    } catch (err) {
        next(err);
    }
};
