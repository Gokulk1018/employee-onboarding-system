const OnboardingUser = require('../models/OnboardingUser');
const OnboardingStatus = require('../models/OnboardingStatus');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailHelper');

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
            candidateName: user.candidateName,
            candidateEmail: user.candidateEmail,
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

// @desc    Verify/Reject a specific document
// @route   PUT /api/onboarding/verify-document/:id
exports.verifyDocument = async (req, res, next) => {
    try {
        const { documentId, status, remarks } = req.body;
        const user = await OnboardingUser.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        const docIndex = user.documents.findIndex(d => d._id.toString() === documentId);
        if (docIndex === -1) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        user.documents[docIndex].status = status;
        user.documents[docIndex].remarks = remarks;
        await user.save();

        res.status(200).json({ success: true, message: `Document status updated to ${status}` });
    } catch (err) {
        next(err);
    }
};

// @desc    Finalize onboarding (HR Only)
// @route   POST /api/onboarding/finalize/:id
exports.finalizeOnboarding = async (req, res, next) => {
    try {
        const { joiningDate } = req.body;
        const user = await OnboardingUser.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        // Create or Update Employee record
        let employee = await Employee.findOne({ email: user.candidateEmail });

        if (!employee) {
            employee = await Employee.create({
                name: user.candidateName,
                email: user.candidateEmail,
                username: user.username,
                password: user.password,
                role: 'employee',
                status: 'Active',
                accountStatus: 'active',
                offerId: user.offerId,
                joinDate: joiningDate || new Date()
            });
        } else {
            employee.joinDate = joiningDate || employee.joinDate;
            employee.status = 'Active';
            await employee.save();
        }

        user.status = 'approved';
        await user.save();

        // Send Email
        try {
            await sendEmail({
                email: user.candidateEmail,
                subject: 'Onboarding Documents Verified',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                        <h2 style="color: #4f46e5;">Congratulations ${user.candidateName}!</h2>
                        <p>We are pleased to inform you that your onboarding documents have been verified successfully.</p>
                        <p>Your official joining date is set for: <strong style="color: #4f46e5;">${new Date(joiningDate).toDateString()}</strong></p>
                        <p>We are excited to have you on board! Please reach out if you have any questions before your first day.</p>
                        <p>Best regards,<br>The HR Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email failed to send during finalization:', emailError);
        }

        res.status(200).json({ success: true, message: 'Onboarding finalized and welcome email sent', data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject onboarding details/documents
// @route   POST /api/onboarding/reject-details/:id
exports.rejectOnboardingDetails = async (req, res, next) => {
    try {
        const { remarks } = req.body;
        const user = await OnboardingUser.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Onboarding user not found' });
        }

        user.status = 'reupload_required';
        await user.save();

        // Send Email
        try {
            await sendEmail({
                email: user.candidateEmail,
                subject: 'Documents Rejected – Action Required',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                        <h2 style="color: #ef4444;">Action Required: Onboarding Documents</h2>
                        <p>Hello ${user.candidateName},</p>
                        <p>Some of your uploaded documents were rejected or require clarification.</p>
                        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                            <strong>HR Remarks:</strong> ${remarks || 'Please check your portal for details.'}
                        </div>
                        <p>Please log in to the employee portal and re-upload the required documents to proceed with your onboarding.</p>
                        <p>Best regards,<br>The HR Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email failed to send during rejection:', emailError);
        }

        res.status(200).json({ success: true, message: 'Rejection notification sent to candidate' });
    } catch (err) {
        next(err);
    }
};
