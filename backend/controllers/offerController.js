const Offer = require('../models/Offer');
const Candidate = require('../models/Candidate');
const OnboardingStatus = require('../models/OnboardingStatus');
const Employee = require('../models/Employee');
const sendEmail = require('../utils/emailHelper');

// @desc    Create new offer & Send Email
// @route   POST /api/offers/create
exports.createOffer = async (req, res, next) => {
    console.log('[DEBUG] Incoming Offer Request:', req.body);

    try {
        const { name, email, phone, role, department, salary, joiningDate, message } = req.body;

        // 1. Explicit Validation
        if (!name || !email || !role || !department || !salary || !joiningDate) {
            res.status(400);
            throw new Error('All fields are required (name, email, role, department, salary, joiningDate)');
        }

        // Validate Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Please provide a valid email address');
        }

        // Validate Salary is a number
        if (isNaN(salary) || Number(salary) <= 0) {
            res.status(400);
            throw new Error('Salary must be a positive number');
        }

        // Validate Date
        const date = new Date(joiningDate);
        if (isNaN(date.getTime())) {
            res.status(400);
            throw new Error('Please provide a valid joining date');
        }

        // 2. Database Operations
        // Always create a new candidate record to avoid mixing data for same email
        candidate = await Candidate.create({ name, email, phone });

        const offer = await Offer.create({
            candidateId: candidate._id,
            role,
            department,
            salary,
            joiningDate: date,
            status: 'Sent'
        });

        // 3. Email Notification
        const acceptUrl = `${process.env.BASE_URL}/api/offers/accept/${offer._id}`;
        const rejectUrl = `${process.env.BASE_URL}/api/offers/reject/${offer._id}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h1 style="color: #007bff;">Job Offer - ${role}</h1>
                <p>Dear ${name},</p>
                <p>We are pleased to offer you the position of <strong>${role}</strong> in our <strong>${department}</strong> department.</p>
                
                ${message ? `<div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <p style="margin: 0; font-style: italic;">"${message}"</p>
                </div>` : ''}

                <p><strong>Offer Details:</strong></p>
                <ul>
                    <li>Joining Date: ${date.toLocaleDateString()}</li>
                    <li>Annual Salary: $${salary}</li>
                </ul>
                <br>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${acceptUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Accept Offer</a>
                    <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject Offer</a>
                </div>
                <br>
                <p style="font-size: 0.9em; color: #666;">If the buttons above do not work, copy and paste these links into your browser:</p>
                <p style="font-size: 0.8em; color: #007bff;">Accept: ${acceptUrl}<br>Reject: ${rejectUrl}</p>
            </div>
        `;

        try {
            await sendEmail({
                email: candidate.email,
                subject: `Job Offer from EOS - ${role}`,
                html: htmlContent
            });
        } catch (err) {
            console.error('[WARNING] Email could not be sent:', err.message);
            // Non-blocking for the final response
        }

        res.status(201).json({ success: true, data: offer });
    } catch (err) {
        // Pass to centralized error handler
        next(err);
    }
};

// @desc    Accept offer via email link
// @route   GET /api/offers/accept/:id
exports.acceptOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id).populate('candidateId');
        if (!offer) {
            return res.status(404).send('<h1>Error</h1><p>Offer not found.</p>');
        }

        // Allow re-processing of offers (remove status check)
        // Update status
        offer.status = 'Accepted';
        await offer.save();

        // Check if employee already exists for this offer to prevent double creation
        let employee = await Employee.findOne({ offerId: offer._id });

        if (!employee) {
            // Create Employee Account Automatically
            employee = await Employee.create({
                name: offer.candidateId.name,
                email: offer.candidateId.email,
                role: offer.role,
                department: offer.department,
                offerId: offer._id,
                joinDate: offer.joiningDate
            });

            // Initialize Onboarding Status
            const onboarding = await OnboardingStatus.create({
                employeeId: employee._id,
                currentStep: 'OFFER_ACCEPTED',
                stepHistory: [{ step: 'OFFER_CREATED' }, { step: 'OFFER_ACCEPTED' }]
            });

            employee.onboardingStatusId = onboarding._id;
            await employee.save();
        }

        // 4. Send Welcome Email
        const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/onboarding`;
        const welcomeHtml = `
            <h1>Welcome to the Team, ${offer.candidateId.name}!</h1>
            <p>We are thrilled to have you join us as a <strong>${offer.role}</strong>.</p>
            <p>Your employee account has been successfully created. The next step in your onboarding journey is to upload the required documents.</p>
            <br>
            <a href="${portalUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Onboarding Portal</a>
            <br><br>
            <p>If you have any questions, please reach out to HR.</p>
        `;

        try {
            await sendEmail({
                email: offer.candidateId.email,
                subject: `Welcome to EOS! Next Steps for Your Onboarding`,
                html: welcomeHtml
            });
        } catch (err) {
            console.error('[WARNING] Welcome email could not be sent:', err.message);
        }

        res.send(`<h1>Success!</h1><p>You have accepted the offer for ${offer.role}. Check your email for next steps!</p>`);
    } catch (err) {
        console.error('Error accepting offer:', err);
        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                <h1 style="color: #dc3545;">Oops! Something went wrong</h1>
                <p>We encountered an error while processing your request. This might be due to a technical issue or if the offer was already processed.</p>
                <p style="color: #666; font-size: 0.9em;">Error: ${err.message}</p>
                <br>
                <a href="mailto:hr@example.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
            </div>
        `);
    }
};

// @desc    Reject offer via email link
// @route   GET /api/offers/reject/:id
exports.rejectOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).send('<h1>Error</h1><p>Offer not found.</p>');
        }

        // Allow re-processing of offers (remove status check)
        offer.status = 'Rejected';
        await offer.save();

        res.send('<h1>Offer Rejected</h1><p>You have declined the offer. We wish you the best in your future endeavors.</p>');
    } catch (err) {
        next(err);
    }
};

// @desc    Get all offers (with filtering & searching)
// @route   GET /api/offers
exports.getOffers = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        let query = {};
        if (status && status !== 'All') query.status = status;

        let offers = await Offer.find(query).populate('candidateId').sort({ createdAt: -1 });

        if (search) {
            const searchLower = search.toLowerCase();
            offers = offers.filter(offer =>
                offer.candidateId && (
                    offer.candidateId.name.toLowerCase().includes(searchLower) ||
                    offer.candidateId.email.toLowerCase().includes(searchLower)
                )
            );
        }

        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (err) {
        next(err);
    }
};

// @desc    Update offer details
// @route   PUT /api/offers/:id
exports.updateOffer = async (req, res, next) => {
    try {
        const { name, phone, role, department, salary, joiningDate, status } = req.body;
        let offer = await Offer.findById(req.params.id);
        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }

        if (name || phone) await Candidate.findByIdAndUpdate(offer.candidateId, { name, phone });

        offer = await Offer.findByIdAndUpdate(req.params.id, {
            role, department, salary, joiningDate,
            status: status || offer.status
        }, { new: true, runValidators: true }).populate('candidateId');

        res.status(200).json({ success: true, data: offer });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
exports.deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }

        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
// @desc    Resend offer email
// @route   POST /api/offers/resend/:id
exports.resendOffer = async (req, res, next) => {
    try {
        // Reset status to 'Sent' when resending (allows re-processing)
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            { status: 'Sent' },
            { new: true }
        ).populate('candidateId');

        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }

        console.log(`[DEBUG] Offer ${offer._id} status reset to 'Sent' and populated.`);

        const candidate = offer.candidateId;
        const role = offer.role;
        const department = offer.department;
        const salary = offer.salary;
        const date = offer.joiningDate;

        // reused email template logic
        const acceptUrl = `${process.env.BASE_URL}/api/offers/accept/${offer._id}`;
        const rejectUrl = `${process.env.BASE_URL}/api/offers/reject/${offer._id}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h1 style="color: #007bff;">Job Offer Reminder - ${role}</h1>
                <p>Dear ${candidate.name},</p>
                <p>This is a reminder regarding your offer for the position of <strong>${role}</strong> in our <strong>${department}</strong> department.</p>
                
                <p><strong>Offer Details:</strong></p>
                <ul>
                    <li>Joining Date: ${date ? new Date(date).toLocaleDateString() : 'N/A'}</li>
                    <li>Annual Salary: $${salary}</li>
                </ul>
                <br>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${acceptUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Accept Offer</a>
                    <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject Offer</a>
                </div>
                <br>
                <p style="font-size: 0.9em; color: #666;">If the buttons above do not work, copy and paste these links into your browser:</p>
                <p style="font-size: 0.8em; color: #007bff;">Accept: ${acceptUrl}<br>Reject: ${rejectUrl}</p>
            </div>
        `;

        await sendEmail({
            email: candidate.email,
            subject: `Reminder: Job Offer from EOS - ${role}`,
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Offer email resent successfully' });
    } catch (err) {
        next(err);
    }
};
