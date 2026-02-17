const HRUser = require('../models/HRUser');
const OnboardingUser = require('../models/OnboardingUser');
const Employee = require('../models/Employee');

// @desc    Unified Login (HR Admin | Employee)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { username, password, roleToggle } = req.body; // roleToggle: 'hr' | 'employee'

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide credentials' });
        }

        const normalizedUsername = username.toLowerCase().trim();

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

            return res.status(200).json({
                success: true,
                role: 'hr',
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

                if (onboardingUser.status === 'approved') {
                    // If approved, they should be in Employee collection, but let's handle the logout/sync later
                    // For now, redirect to employee portal if approved
                } else {
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
            }

            // Check Employee collection
            const employee = await Employee.findOne({ username: normalizedUsername }).select('+password');
            if (employee) {
                // If password exists in employee doc, check it. (Assuming '123' or managed password)
                // Note: Existing employees might not have passwords yet if just created via HR
                const isValid = employee.password ? employee.password === password : password === '123';

                if (isValid) {
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
