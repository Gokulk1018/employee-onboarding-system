const HRUser = require('../models/HRUser');

// Basic protection middleware
// Note: In a production app, this would use JWT. 
// For this demo, we check if a valid HR User ID is passed in the headers.
const protect = async (req, res, next) => {
    let userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no user ID provided'
        });
    }

    try {
        if (userId === 'hardcoded-admin-id') {
            req.user = {
                _id: 'hardcoded-admin-id',
                name: 'Gokul Admin',
                username: 'gokul',
                role: 'hr'
            };
            return next();
        }

        const user = await HRUser.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, invalid ID'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'hr') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied: HR Admin only'
        });
    }
};

module.exports = { protect, admin };
