const Employee = require('../models/Employee');
const Offer = require('../models/Offer');
const OnboardingUser = require('../models/OnboardingUser');
const crypto = require('crypto');
const sendEmail = require('../utils/emailHelper');

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create manual employee (optional utility)
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Generate and send credentials to candidate for onboarding
// @route   POST /api/employees/generate-credentials/:id
exports.generateCredentials = async (req, res, next) => {
    try {
        // Find by Offer ID instead of Employee ID
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        // Generate username = candidate name (lowercase, no spaces)
        const username = offer.candidateName.toLowerCase().replace(/\s+/g, '');
        const password = "123";

        // Create or Update OnboardingUser
        let onboardingUser = await OnboardingUser.findOne({ offerId: offer._id });

        if (onboardingUser) {
            onboardingUser.username = username;
            onboardingUser.password = password;
            await onboardingUser.save();
        } else {
            onboardingUser = await OnboardingUser.create({
                username,
                password,
                candidateName: offer.candidateName,
                candidateEmail: offer.candidateEmail,
                offerId: offer._id
            });
        }

        // Send email
        const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">Your Onboarding Portal Credentials</h2>
                <p>Hello ${offer.candidateName},</p>
                <p>Congratulations on your offer! Please use the following credentials to access the onboarding portal:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                </div>
                <p>Login here: <a href="${loginUrl}" style="color: #7c3aed; font-weight: 600;">Onboarding Portal</a></p>
                <p style="color: #6b7280; font-size: 0.9rem;">Please complete your onboarding tasks as soon as possible.</p>
            </div>
        `;

        await sendEmail({
            email: offer.candidateEmail,
            subject: 'Your Onboarding Portal Credentials',
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Onboarding credentials generated and sent' });
    } catch (err) {
        next(err);
    }
};
