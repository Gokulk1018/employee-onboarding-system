const OnboardingStatus = require('../models/OnboardingStatus');
const Employee = require('../models/Employee');

exports.getOnboardingStatus = async (req, res) => {
    try {
        const status = await OnboardingStatus.findOne({ employeeId: req.params.employeeId });
        if (!status) return res.status(404).json({ success: false, error: 'Onboarding status not found' });
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateOnboardingStep = async (req, res) => {
    try {
        const { step } = req.body;
        const status = await OnboardingStatus.findOneAndUpdate(
            { employeeId: req.params.employeeId },
            {
                $set: { currentStep: step },
                $push: { stepHistory: { step } }
            },
            { new: true }
        );

        if (!status) return res.status(404).json({ success: false, error: 'Onboarding status not found' });

        // If step is ACTIVE, update Employee status
        if (step === 'ACTIVE') {
            await Employee.findByIdAndUpdate(req.params.employeeId, { status: 'ACTIVE' });
        }

        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
