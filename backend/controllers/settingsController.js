const SystemSettings = require('../models/SystemSettings');
const Role = require('../models/Role');
const HRUser = require('../models/HRUser');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// @desc    Get system settings (Company & Security)
// @route   GET /api/settings
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        next(err);
    }
};

// @desc    Update system settings
// @route   PUT /api/settings
exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        if (req.body.companyInfo) {
            settings.companyInfo = { ...settings.companyInfo, ...req.body.companyInfo };
        }
        if (req.body.security) {
            settings.security = { ...settings.security, ...req.body.security };
        }

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all roles and permissions
// @route   GET /api/settings/roles
exports.getRoles = async (req, res, next) => {
    try {
        let roles = await Role.find();

        // Seed default roles if empty or outdated
        if (roles.length === 0) {
            const defaultRoles = [
                {
                    name: 'Admin',
                    permissions: {
                        recruitment: true, onboarding: true, payroll: true,
                        engagement: true, tasks: true, settings: true
                    }
                },
                {
                    name: 'HR',
                    permissions: {
                        recruitment: true, onboarding: true, payroll: true,
                        engagement: true, tasks: true, settings: true
                    }
                },
                {
                    name: 'Manager',
                    permissions: {
                        recruitment: false, onboarding: false, payroll: true,
                        engagement: true, tasks: true, settings: false
                    }
                },
                {
                    name: 'Employee',
                    permissions: {
                        recruitment: false, onboarding: false, payroll: false,
                        engagement: true, tasks: true, settings: false
                    }
                }
            ];
            roles = await Role.insertMany(defaultRoles);
        }

        res.status(200).json({ success: true, data: roles });
    } catch (err) {
        next(err);
    }
};

// @desc    Update role permissions
// @route   PUT /api/settings/roles/:id
exports.updateRolePermissions = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { permissions: req.body.permissions },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all employees (HR + Standard Employees)
// @route   GET /api/settings/users
exports.getUsers = async (req, res, next) => {
    try {
        const hrUsers = await HRUser.find().select('-password');
        const employees = await Employee.find().select('-password');

        // Normalize data for frontend table
        const combined = [
            ...hrUsers.map(u => ({
                _id: u._id,
                name: u.username, // Assuming username is name, or add name to HR model
                email: u.email || `${u.username}@hrflow.com`,
                role: 'HR',
                accountStatus: u.status || 'active',
                type: 'hr'
            })),
            ...employees.map(u => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                role: 'Employee',
                accountStatus: u.accountStatus || 'active',
                type: 'employee'
            }))
        ];

        res.status(200).json({ success: true, data: combined });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle user account status (active/blocked)
// @route   PUT /api/settings/users/:id/toggle-status
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { type } = req.body;
        let user;

        if (type === 'hr') {
            user = await HRUser.findById(req.params.id);
            if (user) {
                user.status = user.status === 'active' ? 'blocked' : 'active';
                await user.save();
            }
        } else {
            user = await Employee.findById(req.params.id);
            if (user) {
                user.accountStatus = user.accountStatus === 'active' ? 'blocked' : 'active';
                await user.save();
            }
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Change user password
// @route   POST /api/settings/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, userId, userRole } = req.body;

        if (!currentPassword || !newPassword || !userId) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        let user;
        if (userRole === 'hr') {
            user = await HRUser.findById(userId).select('+password');
        } else {
            user = await Employee.findById(userId).select('+password');
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Validate current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            // Fallback for non-hashed legacy passwords (if any)
            if (user.password !== currentPassword) {
                return res.status(401).json({ success: false, message: 'Incorrect current password' });
            }
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Upload company logo
// @route   POST /api/settings/upload-logo
exports.uploadLogo = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const logoUrl = `/uploads/${req.file.filename}`;

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        settings.companyInfo.logoUrl = logoUrl;
        await settings.save();

        res.status(200).json({ success: true, data: { logoUrl } });
    } catch (err) {
        next(err);
    }
};
