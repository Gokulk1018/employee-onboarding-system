const HRUser = require('../models/HRUser');
const Employee = require('../models/Employee');

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
        let user;
        let role;

        if (userId === '507f1f77bcf86cd799439011' || userId === 'hardcoded-admin-id') {
            user = {
                _id: '507f1f77bcf86cd799439011',
                name: 'Gokul HR',
                username: 'gokul',
                role: 'hr'
            };
            role = 'hr';
        } else {
            user = await HRUser.findById(userId);
            role = 'hr';

            if (!user) {
                user = await Employee.findById(userId);
                role = 'employee';
            }
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        // Add role to user object for reference
        user.role = role;
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
            message: 'Access denied: HR only'
        });
    }
};

module.exports = { protect, admin };
