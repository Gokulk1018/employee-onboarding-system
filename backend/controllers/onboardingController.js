const OnboardingUser = require('../models/OnboardingUser');
const OnboardingStatus = require('../models/OnboardingStatus');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');

// @desc    Submit onboarding form data
// @route   POST /api/onboarding/submit
exports.submitOnboardingForm = async (req, res, next) => {
    try {
        const { userId, personalData, documents } = req.body;

        const user = await OnboardingUser.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        user.status = 'submitted';
        user.onboardingData = personalData;
        user.documents = documents;
        await user.save();

        // Create HR Notification
        await Notification.create({
            message: `New onboarding form submitted by ${user.candidateName}`,
            status: 'Pending',
            createdAt: new Date()
        });

        res.status(200).json({ success: true, message: 'Onboarding form submitted' });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve onboarding (HR Only)
// @route   POST /api/onboarding/approve/:id
exports.approveOnboarding = async (req, res, next) => {
    try {
        const user = await OnboardingUser.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        // Create Employee record
        const employee = await Employee.create({
            name: user.candidateName,
            email: user.candidateEmail,
            username: user.username,
            password: user.password, // Set their password
            role: 'employee',
            status: 'Active',
            accountStatus: 'active',
            offerId: user.offerId,
            joinDate: new Date()
        });

        // Update onboarding user status
        user.status = 'approved';
        await user.save();

        res.status(200).json({ success: true, message: 'Candidate approved and converted to employee', data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject onboarding (HR Only)
// @route   POST /api/onboarding/reject/:id
exports.rejectOnboarding = async (req, res, next) => {
    try {
        const user = await OnboardingUser.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        user.status = 'rejected';
        await user.save();

        res.status(200).json({ success: true, message: 'Onboarding rejected' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all onboarding users (HR Only)
// @route   GET /api/onboarding/users
exports.getAllOnboardingUsers = async (req, res, next) => {
    try {
        const users = await OnboardingUser.find().sort('-createdAt');
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

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
