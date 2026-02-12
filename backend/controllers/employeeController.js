const Employee = require('../models/Employee');
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

// @desc    Generate and send credentials to employee
// @route   POST /api/employees/generate-credentials/:id
exports.generateCredentials = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Generate username (email)
        const username = employee.email;
        const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char random hex

        // Hash password using built-in crypto
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(tempPassword, salt, 1000, 64, 'sha512').toString('hex');
        const hashedPassword = `${salt}:${hash}`;

        // Update employee
        employee.username = username;
        employee.password = hashedPassword;
        employee.role = 'employee';
        employee.accountStatus = 'active';
        await employee.save();

        // Send email
        const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173/login';
        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">Your Employee Portal Login Credentials</h2>
                <p>Hello ${employee.name},</p>
                <p>Your account has been created. Use the following credentials to log in to the employee portal:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                </div>
                <p>Login here: <a href="${loginUrl}" style="color: #7c3aed; font-weight: 600;">Log In</a></p>
                <p style="color: #6b7280; font-size: 0.9rem;">Important: Please change your password after your first login.</p>
            </div>
        `;

        await sendEmail({
            email: employee.email,
            subject: 'Your Employee Portal Login Credentials',
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Credentials generated and sent successfully' });
    } catch (err) {
        next(err);
    }
};
