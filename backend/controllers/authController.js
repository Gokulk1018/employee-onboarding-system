const HRUser = require('../models/HRUser');
const OnboardingUser = require('../models/OnboardingUser');
const Employee = require('../models/Employee');
const SystemSettings = require('../models/SystemSettings');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailHelper');
const bcrypt = require('bcryptjs');

// @desc    Unified Login (HR | Employee)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { username, password, roleToggle } = req.body; // roleToggle: 'hr' | 'employee'

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide credentials' });
        }

        const normalizedUsername = username.toLowerCase().trim();

        if (roleToggle === 'hr') {
            const isHardcodedGokul = normalizedUsername === 'gokul' && password === '1018';

            // Fast-path instant login for default HR credentials without DB latency
            if (isHardcodedGokul) {
                const token = jwt.sign(
                    { id: '507f1f77bcf86cd799439011', role: 'hr' },
                    process.env.JWT_SECRET || 'hrflow_pro_secret_key_2026_antigravity',
                    { expiresIn: '24h' }
                );

                return res.status(200).json({
                    success: true,
                    role: 'hr',
                    token,
                    data: {
                        userId: '507f1f77bcf86cd799439011',
                        username: 'gokul',
                        name: 'Gokul HR',
                        avatar: '',
                        role: 'hr'
                    }
                });
            }

            let settings = null;
            let user = null;
            try {
                settings = await SystemSettings.findOne();
                user = await HRUser.findOne({ username: normalizedUsername });
            } catch (dbErr) {
                console.error('Database query warning during HR login:', dbErr.message);
            }

            let isMatch = false;
            if (user) {
                // Check if password is hashed (starts with $2a$ or $2b$)
                if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                    isMatch = await bcrypt.compare(password, user.password);
                } else {
                    isMatch = user.password === password;
                }
            }

            if (!isMatch) {
                // Handle failed attempt for existing user
                if (user) {
                    user.failedLoginAttempts += 1;
                    user.lastFailedLogin = new Date();
                    await user.save();

                    if (user.failedLoginAttempts >= 2 && settings?.security?.loginAlert) {
                        const hrEmail = settings.companyInfo?.hrEmail || 'hr@hrflow.com';
                        await sendEmail({
                            email: hrEmail,
                            subject: 'Security Alert: Multiple Failed Login Attempts',
                            html: `<p>Warning: <b>${user.failedLoginAttempts}</b> failed login attempts detected for HR: <b>${normalizedUsername}</b></p>
                                    <p>Time: ${new Date().toLocaleString()}</p>
                                    <p>Please ensure your account is secure.</p>`
                        }).catch(err => console.error('Security alert failed:', err));
                    }
                }
                return res.status(401).json({ success: false, message: 'Invalid HR credentials' });
            }

            // SUCCESSFUL LOGIN
            if (user) {
                user.failedLoginAttempts = 0;
                user.lastFailedLogin = undefined;
                await user.save();

                // Check status
                if (user.status === 'blocked') {
                    return res.status(401).json({ success: false, message: 'Account blocked. Contact HR.' });
                }
            }

            // Success alert if configured
            if (settings?.security?.loginAlert) {
                const hrEmail = settings.companyInfo?.hrEmail || 'hr@hrflow.com';
                await sendEmail({
                    email: hrEmail,
                    subject: 'New HR Login Detected',
                    html: `<p>A new login attempt was successful for HR: <b>${normalizedUsername}</b></p>
                            <p>Time: ${new Date().toLocaleString()}</p>`
                }).catch(err => console.error('Login alert failed:', err));
            }

            // Generate token for HR user
            const sessionTimeout = settings?.security?.sessionTimeout ? `${settings.security.sessionTimeout}m` : '24h';

            const token = jwt.sign(
                { id: user ? user._id : '507f1f77bcf86cd799439011', role: 'hr' },
                process.env.JWT_SECRET,
                { expiresIn: sessionTimeout }
            );

            return res.status(200).json({
                success: true,
                role: 'hr',
                token,
                data: {
                    userId: user ? user._id : '507f1f77bcf86cd799439011',
                    username: user ? user.username : 'gokul',
                    name: user ? user.name : 'Gokul HR',
                    avatar: user ? user.avatar : '',
                    role: 'hr'
                }
            });
        } else {
            // Employee Toggle - check candidates (onboarding) first
            let onboardingUser = await OnboardingUser.findOne({ username: normalizedUsername });

            if (onboardingUser) {
                if (onboardingUser.password !== password) {
                    return res.status(401).json({ success: false, message: 'Invalid credentials' });
                }

                const userData = {
                    userId: onboardingUser._id,
                    username: onboardingUser.username,
                    name: onboardingUser.candidateName,
                    avatar: '',
                    offerId: onboardingUser.offerId,
                    status: onboardingUser.status,
                    role: 'onboarding'
                };

                // Generate token for Onboarding User
                const token = jwt.sign(
                    { id: onboardingUser._id, role: 'onboarding' },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(200).json({
                    success: true,
                    token,
                    role: 'onboarding',
                    data: userData
                });
            }

            // Check Employee collection
            // Try normalized name login first as requested: username = name, password = 111
            const trimmedUsername = username.trim();
            let employee = await Employee.findOne({
                $or: [
                    { name: new RegExp(`^${trimmedUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                    { username: normalizedUsername }
                ]
            }).select('+password');

            if (employee) {
                // Check if account is blocked
                if (employee.accountStatus === 'blocked') {
                    return res.status(401).json({ success: false, message: 'Account blocked. Contact HR.' });
                }

                let isMatch = false;
                // Special case for requested default password "111"
                if (password === '111') {
                    isMatch = true;
                } else if (employee.password) {
                    // Check if password is hashed (starts with $2a$ or $2b$)
                    if (employee.password.startsWith('$2a$') || employee.password.startsWith('$2b$')) {
                        isMatch = await bcrypt.compare(password, employee.password);
                    } else {
                        isMatch = employee.password === password;
                    }
                } else {
                    isMatch = password === '123' || password === '111'; // Default password fallbacks
                }

                if (isMatch) {
                    // Login Alert logic
                    if (settings?.security?.loginAlert) {
                        const hrEmail = settings.companyInfo?.hrEmail || 'hr@hrflow.com';
                        await sendEmail({
                            email: hrEmail,
                            subject: 'Employee Login Notification',
                            html: `<p>Employee <b>${employee.name}</b> (${normalizedUsername}) has logged in.</p>
                                   <p>Time: ${new Date().toLocaleString()}</p>`
                        }).catch(err => console.error('Login alert failed:', err));
                    }

                    // Generate token for Employee
                    const sessionTimeout = settings?.security?.sessionTimeout ? `${settings.security.sessionTimeout}m` : '24h';
                    const token = jwt.sign(
                        { id: employee._id, role: 'employee' },
                        process.env.JWT_SECRET,
                        { expiresIn: sessionTimeout }
                    );

                    return res.status(200).json({
                        success: true,
                        role: 'employee',
                        token,
                        data: {
                            userId: employee._id,
                            username: employee.username || employee.name,
                            name: employee.name,
                            avatar: employee.avatar || '',
                            role: 'employee'
                        }
                    });
                }
            }

            return res.status(401).json({ success: false, message: 'Invalid employee credentials' });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        const role = req.user.role;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
        }

        let user;
        if (role === 'hr') {
            user = await HRUser.findById(userId).select('+password');
        } else {
            user = await Employee.findById(userId).select('+password');
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        let isMatch = false;
        // Check for hashed password or direct match (for legacy/simple passwords)
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(currentPassword, user.password);
        } else {
            isMatch = user.password === currentPassword;
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid current password' });
        }

        // Update with hashed password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get HR Profile
// @route   GET /api/auth/me
exports.getHRProfile = async (req, res, next) => {
    try {
        const user = await HRUser.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update HR Profile
// @route   PUT /api/auth/profile
exports.updateHRProfile = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const user = await HRUser.findByIdAndUpdate(
            req.user._id,
            { name, email, avatar },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Upload HR Avatar
// @route   POST /api/auth/upload-avatar
exports.uploadHRAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, url: fileUrl });
    } catch (err) {
        next(err);
    }
};

// Exports
module.exports = {
    login: exports.login,
    changePassword: exports.changePassword,
    getHRProfile: exports.getHRProfile,
    updateHRProfile: exports.updateHRProfile,
    uploadHRAvatar: exports.uploadHRAvatar
};
