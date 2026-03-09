const Offer = require('../models/Offer');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailHelper');
const crypto = require('crypto');

// Define onboarding steps in order
const ONBOARDING_STEPS = ['Offer Accepted', 'Documentation', 'IT Setup', 'Orientation', 'Ready'];

// @desc    Create new offer & Send Email
// @route   POST /api/offers/create
exports.createOffer = async (req, res, next) => {
    try {
        const {
            candidateName,
            candidateEmail,
            candidatePhone,
            department,
            role,
            salary,
            joiningDate,
            personalMessage
        } = req.body;

        // Validation
        if (!candidateName || !candidateEmail || !department || !role || !salary || !joiningDate) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing: name, email, department, role, salary, and joining date are mandatory.'
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        const offer = await Offer.create({
            candidateName,
            candidateEmail,
            candidatePhone,
            department,
            role,
            salary,
            joiningDate,
            personalMessage,
            status: 'Sent',
            token
        });

        // Email logic with modern card design
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const acceptUrl = `${baseUrl}/api/offers/accept/${token}`;
        const rejectUrl = `${baseUrl}/api/offers/reject/${token}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    .card {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 40px;
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        color: #1f2937;
                        border: 1px solid #e5e7eb;
                    }
                    .h1 { color: #7c3aed; font-size: 24px; margin-bottom: 24px; text-align: center; }
                    .btn {
                        display: inline-block;
                        padding: 12px 32px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                        margin: 10px;
                        transition: opacity 0.2s;
                    }
                    .btn-accept { background-color: #10b981; color: #ffffff !important; }
                    .btn-reject { background-color: #ef4444; color: #ffffff !important; }
                    .details { background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0; }
                    .message-box { border-left: 4px solid #7c3aed; padding-left: 16px; font-style: italic; color: #4b5563; margin: 20px 0; }
                </style>
            </head>
            <body style="background-color: #f3f4f6; padding: 20px;">
                <div class="card">
                    <h1 class="h1">Job Offer - ${role}</h1>
                    <p>Dear ${candidateName},</p>
                    <p>We are pleased to offer you the position of <strong>${role}</strong> in our <strong>${department}</strong> department.</p>
                    
                    ${personalMessage ? `<div class="message-box">${personalMessage}</div>` : ''}

                    <div class="details">
                        <p style="margin: 0;"><strong>Offer Details:</strong></p>
                        <ul style="margin: 12px 0; padding-left: 20px;">
                            <li>Joining Date: ${new Date(joiningDate).toLocaleDateString()}</li>
                            <li>Annual Salary: $${salary.toLocaleString()}</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${acceptUrl}" class="btn btn-accept">Accept Offer</a>
                        <a href="${rejectUrl}" class="btn btn-reject">Reject Offer</a>
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            await sendEmail({
                email: candidateEmail,
                subject: `Job Offer - ${role}`,
                html: htmlContent
            });
        } catch (err) {
            console.error('[WARNING] Email send failed:', err.message);
        }

        res.status(201).json({ success: true, data: offer });
    } catch (err) {
        next(err);
    }
};

// @desc    Accept offer via token
// @route   GET /api/offers/accept/:token
exports.acceptOffer = async (req, res) => {
    try {
        const offer = await Offer.findOne({ token: req.params.token });
        if (!offer) return res.status(404).send('<h1>Invalid or expired link</h1><p>We could not find the offer associated with this link.</p>');

        offer.status = 'Accepted';
        await offer.save();

        // Create notification for HR (Global)
        await Notification.create({
            title: 'Offer Accepted',
            candidateName: offer.candidateName,
            candidateEmail: offer.candidateEmail,
            status: 'Accepted',
            message: `${offer.candidateName} has ACCEPTED the offer.`,
            isGlobal: true,
            link: '/onboarding'
        });


        res.send(`
            <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                <h1 style="color: #10b981;">Offer Accepted!</h1>
                <p>Congratulations! You have successfully accepted the offer for ${offer.role}.</p>
                <p>The HR team will contact you shortly with the next steps.</p>
            </div>
        `);
    } catch (err) {
        res.status(500).send('<h1>Error</h1><p>Server internal error.</p>');
    }
};

// @desc    Reject offer via token
// @route   GET /api/offers/reject/:token
exports.rejectOffer = async (req, res) => {
    try {
        const offer = await Offer.findOne({ token: req.params.token });
        if (!offer) return res.status(404).send('<h1>Invalid or expired link</h1>');

        offer.status = 'Rejected';
        await offer.save();

        // Create notification for HR (Global)
        await Notification.create({
            title: 'Offer Rejected',
            candidateName: offer.candidateName,
            candidateEmail: offer.candidateEmail,
            status: 'Rejected',
            message: `${offer.candidateName} has REJECTED the offer.`,
            isGlobal: true,
            link: '/recruitment'
        });


        res.send(`
            <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                <h1 style="color: #ef4444;">Offer Rejected</h1>
                <p>You have declined the offer for ${offer.role}. We wish you the best in your future endeavors.</p>
            </div>
        `);
    } catch (err) {
        res.status(500).send('<h1>Error</h1>');
    }
};

// @desc    Get all offers
exports.getOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete offer
exports.deleteOffer = async (req, res, next) => {
    try {
        const OnboardingUser = require('../models/OnboardingUser');
        const offerId = req.params.id;

        await Offer.findByIdAndDelete(offerId);
        // Clean up associated onboarding user as well
        await OnboardingUser.findOneAndDelete({ offerId });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
exports.updateOffer = async (req, res, next) => {
    try {
        const {
            candidateName,
            candidateEmail,
            candidatePhone,
            department,
            role,
            salary,
            joiningDate,
            personalMessage
        } = req.body;

        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            {
                candidateName,
                candidateEmail,
                candidatePhone,
                department,
                role,
                salary,
                joiningDate,
                personalMessage
            },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOffer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Resend offer email
// @route   POST /api/offers/resend/:id
exports.resendOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        // Logic to resend email
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const acceptUrl = `${baseUrl}/api/offers/accept/${offer.token}`;
        const rejectUrl = `${baseUrl}/api/offers/reject/${offer.token}`;

        const htmlContent = `
            <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                            <style>
                                .card {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    background: #ffffff;
                                    padding: 40px;
                                    border-radius: 16px;
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    color: #1f2937;
                                    border: 1px solid #e5e7eb;
                                }
                                .h1 {color: #7c3aed; font-size: 24px; margin-bottom: 24px; text-align: center; }
                                .btn {
                                    display: inline-block;
                                    padding: 12px 32px;
                                    border-radius: 8px;
                                    text-decoration: none;
                                    font-weight: 600;
                                    margin: 10px;
                                    transition: opacity 0.2s;
                                }
                                .btn-accept {background-color: #10b981; color: #ffffff !important; }
                                .btn-reject {background-color: #ef4444; color: #ffffff !important; }
                                .details {background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0; }
                                .message-box {border-left: 4px solid #7c3aed; padding-left: 16px; font-style: italic; color: #4b5563; margin: 20px 0; }
                            </style>
                    </head>
                    <body style="background-color: #f3f4f6; padding: 20px;">
                        <div class="card">
                            <h1 class="h1">Job Offer - ${offer.role} (Updated)</h1>
                            <p>Dear ${offer.candidateName},</p>
                            <p>We are following up on our previous offer for the position of <strong>${offer.role}</strong> in our <strong>${offer.department}</strong> department.</p>

                            ${offer.personalMessage ? `<div class="message-box">${offer.personalMessage}</div>` : ''}

                            <div class="details">
                                <p style="margin: 0;"><strong>Offer Details:</strong></p>
                                <ul style="margin: 12px 0; padding-left: 20px;">
                                    <li>Joining Date: ${new Date(offer.joiningDate).toLocaleDateString()}</li>
                                    <li>Annual Salary: $${offer.salary.toLocaleString()}</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin-top: 32px;">
                                <a href="${acceptUrl}" class="btn btn-accept">Accept Offer</a>
                                <a href="${rejectUrl}" class="btn btn-reject">Reject Offer</a>
                            </div>
                        </div>
                    </body>
                </html>
        `;

        try {
            await sendEmail({
                email: offer.candidateEmail,
                subject: `Job Offer - ${offer.role} (Follow-up)`,
                html: htmlContent
            });

            // If the offer was rejected, reset it to 'Sent' upon resending
            if (offer.status === 'Rejected') {
                offer.status = 'Sent';
                await offer.save();
            }
        } catch (err) {
            console.error('[WARNING] Email send failed during resend:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Failed to send email, please check configuration.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Offer email resent successfully'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Advance onboarding step
// @route   POST /api/offers/:id/advance
exports.advanceOnboardingStep = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        const currentStepIndex = ONBOARDING_STEPS.indexOf(offer.onboardingStep || 'Offer Accepted');

        if (currentStepIndex === -1) {
            // If for some reason the step is invalid, reset to start
            offer.onboardingStep = 'Offer Accepted';
        }

        console.log(`[DEBUG] Candidate: ${offer.candidateName}, Index: ${currentStepIndex}, Next: ${currentStepIndex + 1}, Setting Step to: "${ONBOARDING_STEPS[currentStepIndex + 1]}"`);
        offer.onboardingStep = ONBOARDING_STEPS[currentStepIndex + 1];

        await offer.save();

        res.status(200).json({
            success: true,
            data: offer,
            message: `Moved to ${offer.onboardingStep}`
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Convert offer to employee
// @route   POST /api/offers/:id/convert
exports.convertOfferToEmployee = async (req, res, next) => {
    try {
        console.log(`\n\x1b[36m[DEBUG-CONVERT] START: Processing conversion for ID: ${req.params.id}\x1b[0m`);

        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            console.log(`\x1b[31m[DEBUG-CONVERT] ERROR: Offer not found!\x1b[0m`);
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        console.log(`\x1b[32m[DEBUG-CONVERT] Candidate: ${offer.candidateName}\x1b[0m`);
        console.log(`\x1b[32m[DEBUG-CONVERT] Step: "${offer.onboardingStep}"\x1b[0m`);
        console.log(`\x1b[32m[DEBUG-CONVERT] Status: ${offer.status}\x1b[0m`);

        if (offer.onboardingStep !== 'Ready') {
            const msg = `Candidate ${offer.candidateName} is in ${offer.onboardingStep} stage, must be Ready.`;
            console.log(`\x1b[31m[DEBUG-CONVERT] ERROR: ${msg}\x1b[0m`);
            return res.status(400).json({
                success: false,
                message: `Candidate must be in Ready stage to be added as an employee. Current stage: ${offer.onboardingStep}`
            });
        }

        // Create the employee record
        console.log(`\x1b[33m[DEBUG-CONVERT] Creating Employee Record...\x1b[0m`);
        let employee;
        try {
            // Check if employee with same email already exists
            const existingEmployee = await Employee.findOne({ email: offer.candidateEmail });
            if (existingEmployee) {
                console.log(`\x1b[31m[DEBUG-CONVERT] ERROR: Employee with email ${offer.candidateEmail} already exists!\x1b[0m`);
                return res.status(400).json({
                    success: false,
                    message: `An employee with the email ${offer.candidateEmail} already exists in the system.`
                });
            }

            const employeeData = {
                name: offer.candidateName,
                email: offer.candidateEmail,
                department: offer.department,
                role: offer.role,
                joinDate: offer.joiningDate,
                offerId: offer._id,
                status: 'Active'
            };
            console.log(`\x1b[33m[DEBUG-CONVERT] Employee Payload: ${JSON.stringify(employeeData, null, 2)}\x1b[0m`);

            employee = await Employee.create(employeeData);
            console.log(`\x1b[32m[DEBUG-CONVERT] SUCCESS: Employee Created with ID: ${employee._id}\x1b[0m`);
        } catch (createErr) {
            console.error(`\x1b[31m[DEBUG-CONVERT] CREATE_FAILED: ${createErr.message}\x1b[0m`);
            if (createErr.errors) {
                Object.keys(createErr.errors).forEach(key => {
                    console.error(`\x1b[31m  - ${key}: ${createErr.errors[key].message}\x1b[0m`);
                });
            }
            return res.status(400).json({
                success: false,
                message: `Failed to create employee record: ${createErr.message}`,
                error: createErr.message
            });
        }

        // Delete the matching onboarding user to clean up
        console.log(`\x1b[33m[DEBUG-CONVERT] Cleaning up OnboardingUser...\x1b[0m`);
        const OnboardingUser = require('../models/OnboardingUser');
        await OnboardingUser.findOneAndDelete({ offerId: offer._id });

        // Delete the offer after employee is created
        console.log(`\x1b[33m[DEBUG-CONVERT] Deleting Offer Record...\x1b[0m`);
        await Offer.findByIdAndDelete(req.params.id);

        console.log(`\x1b[32m[DEBUG-CONVERT] FINISHED: ${offer.candidateName} converted successfully!\x1b[0m\n`);

        res.status(200).json({
            success: true,
            data: employee,
            message: 'Employee created successfully and onboarding record cleared'
        });
    } catch (err) {
        console.error(`\x1b[31m[DEBUG-CONVERT] UNEXPECTED_ERROR:\x1b[0m`, err);
        next(err);
    }
};
