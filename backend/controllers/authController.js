const HRUser = require('../models/HRUser');
const OnboardingUser = require('../models/OnboardingUser');
const Employee = require('../models/Employee');
const SystemSettings = require('../models/SystemSettings');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailHelper');

// @desc    Unified Login (HR Admin | Employee)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { username, password, roleToggle } = req.body; // roleToggle: 'hr' | 'employee'

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide credentials' });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const settings = await SystemSettings.findOne();

        if (roleToggle === 'hr') {
            const user = await HRUser.findOne({ username: normalizedUsername });

            // Hardcoded fallback for Gokul
            const isHardcodedGokul = normalizedUsername === 'gokul' && password === '1018';

            if (!user && !isHardcodedGokul) {
                return res.status(401).json({ success: false, message: 'Invalid HR credentials' });
            }

            if (user && user.password !== password && !isHardcodedGokul) {
                return res.status(401).json({ success: false, message: 'Invalid HR credentials' });
            }

            // Check status if user account exists
            if (user && user.status === 'blocked') {
                return res.status(401).json({ success: false, message: 'Account blocked. Contact Admin.' });
            }

            // Login Alert logic
            if (settings?.security?.loginAlert) {
                const hrEmail = settings.companyInfo?.hrEmail || 'hr@hrflow.com';
                await sendEmail({
                    email: hrEmail,
                    subject: 'New HR Login Detected',
                    html: `<p>A new login attempt was successful for HR Admin: <b>${normalizedUsername}</b></p>
                           <p>Time: ${new Date().toLocaleString()}</p>`
                }).catch(err => console.error('Login alert failed:', err));
            }

            // Generate token for HR user
            console.log('Attempting to sign JWT with secret length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'MISSING');

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is missing in environment variables');
            }

            const token = jwt.sign({ id: user ? user._id : '507f1f77bcf86cd799439011', role: 'hr' }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE || '24h'
            });

            return res.status(200).json({
                success: true,
                role: 'hr',
                token,
                data: {
                    userId: user ? user._id : '507f1f77bcf86cd799439011',
                    username: user ? user.username : 'gokul',
                    name: user ? user.name : 'Gokul Admin',
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

                return res.status(200).json({
                    success: true,
                    role: 'onboarding',
                    data: {
                        userId: onboardingUser._id,
                        username: onboardingUser.username,
                        name: onboardingUser.candidateName,
                        offerId: onboardingUser.offerId,
                        status: onboardingUser.status,
                        role: 'onboarding'
                    }
                });
            }

            // Check Employee collection
            const employee = await Employee.findOne({ username: normalizedUsername }).select('+password');
            if (employee) {
                // Check if account is blocked
                if (employee.accountStatus === 'blocked') {
                    return res.status(401).json({ success: false, message: 'Account blocked. Contact HR.' });
                }

                const isValid = employee.password ? employee.password === password : password === '123';

                if (isValid) {
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

                    return res.status(200).json({
                        success: true,
                        role: 'employee',
                        data: {
                            userId: employee._id,
                            username: employee.username,
                            name: employee.name,
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

// @desc    Seed HR User (Development only)
// @route   POST /api/auth/seed-hr
exports.seedHR = async (req, res, next) => {
    try {
        const username = 'gokul';
        const password = '1018';

        let user = await HRUser.findOne({ username });

        if (user) {
            user.password = password;
            await user.save();
            return res.status(200).json({ success: true, message: 'HR user credentials updated successfully' });
        }

        await HRUser.create({
            username,
            password,
            name: 'Gokul Admin',
            email: 'gokulk.1018@gmail.com'
        });

        res.status(201).json({ success: true, message: 'HR user seeded successfully' });
    } catch (err) {
        next(err);
    }
};
